import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";
import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [showPlatformPicker, setShowPlatformPicker] = useState(false);

    // Fetch connected accounts
    const fetchAccounts = async (
        isSync = false,
        platform: string | null = null,
        successMsg?: string
    ) => {
        try {
            if (isSync) {
                const label = platform
                    ? platform.charAt(0).toUpperCase() + platform.slice(1)
                    : "Social Media";

                toast.loading(`Syncing ${label} account...`, {
                    id: "sync"
                });

                await api.get("/api/oauth/sync");

                toast.success(
                    successMsg || "Accounts synced!",
                    {
                        id: "sync"
                    }
                );
            }

            const { data } = await api.get("/api/accounts");

            setAccounts(Array.isArray(data) ? data : []);

        } catch (error: any) {
            console.error("Fetch accounts error:", error);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load accounts"
            );
        }
    };


    // Handle OAuth callback
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const connectedPlatform = params.get("connected");
        const connectedUsername = params.get("username");
        const errorMsg = params.get("error");

        // Remove OAuth query parameters from browser URL
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        if (connectedPlatform) {
            const label =
                connectedPlatform.charAt(0).toUpperCase() +
                connectedPlatform.slice(1);

            const handle = connectedUsername
                ? ` (@${connectedUsername})`
                : "";

            fetchAccounts(
                true,
                connectedPlatform,
                `${label}${handle} connected!`
            );

        } else if (errorMsg) {
            toast.error(
                `Connection failed: ${decodeURIComponent(errorMsg)}`
            );

            fetchAccounts();

        } else {
            fetchAccounts();
        }

    }, []);


    // Disconnect account
    const handleDisconnect = async (accountId: string) => {
        try {
            await api.delete(`/api/accounts/${accountId}`);

            toast.success("Account disconnected");

            await fetchAccounts();

        } catch (error: any) {
            console.error("Disconnect account error:", error);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to disconnect account"
            );
        }
    };


    // Connected platform IDs
    const connectedIds = accounts
        .map((account) => account.platform)
        .filter(Boolean);


    // Connect platform
    const handleConnect = async (platformId: string) => {
        if (!platformId) {
            toast.error("Invalid platform");
            return;
        }

        setConnecting(platformId);

        console.log("Connecting platform:", platformId);

        try {
            const response = await api.get(
                `/api/oauth/${platformId}/url`
            );

            const data = response.data;

            console.log("OAuth response:", data);

            /*
             * Backend MUST return:
             *
             * {
             *     url: "https://..."
             * }
             */

            if (!data) {
                throw new Error(
                    "Empty response received from server"
                );
            }

            if (!data.url) {
                console.error(
                    "OAuth URL missing. Backend response:",
                    data
                );

                throw new Error(
                    data.message ||
                    "OAuth URL was not returned by the server"
                );
            }

            // Close modal before redirecting
            setShowPlatformPicker(false);

            // Redirect to OAuth provider
            window.location.assign(data.url);

        } catch (error: any) {
            console.error(
                `Failed to connect ${platformId}:`,
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                `Failed to connect ${platformId}`;

            toast.error(message);

            setConnecting(null);
        }
    };


    return (
        <div className="space-y-8 max-w-4xl">

            {/* HEADER */}
            <div className="
                flex
                flex-col
                sm:flex-row
                items-start
                sm:items-center
                justify-between
                gap-4
            ">

                <div>

                    <h2 className="
                        text-2xl
                        font-medium
                        text-slate-900
                    ">
                        Connected Accounts
                    </h2>

                    <p className="
                        text-slate-500
                        text-sm
                        mt-0.5
                    ">
                        {accounts.length} of {PLATFORMS.length} platforms connected
                    </p>

                </div>


                {/* CONNECT ACCOUNT BUTTON */}
                <button
                    onClick={() => setShowPlatformPicker(true)}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-2.5
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        rounded-full
                        font-medium
                        transition-all
                        w-full
                        sm:w-auto
                    "
                >
                    <PlusIcon className="size-4 shrink-0" />

                    <span>
                        Connect Account
                    </span>

                </button>

            </div>


            {/* PLATFORM PICKER MODAL */}
            {showPlatformPicker && (
                <PlatformPickerModal
                    connectedIds={connectedIds}
                    connecting={connecting}
                    onClose={() => {
                        if (!connecting) {
                            setShowPlatformPicker(false);
                        }
                    }}
                    onConnect={handleConnect}
                />
            )}


            {/* CONNECTED ACCOUNTS */}
            <AccountList
                accounts={accounts}
                onDisconnect={handleDisconnect}
            />

        </div>
    );
};

export default Accounts;