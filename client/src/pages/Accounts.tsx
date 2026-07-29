import { useEffect, useState } from "react"
import { PlusIcon } from 'lucide-react'
import { dummyAccountsData, PLATFORMS } from "../assets/assets"
import AccountList from "../components/AccountList";
import PlatformPickerModal from "../components/PlatformPickerModal";

const Accounts = () => {
    

   const [accounts ,setAccounts] = useState<any[]>([])
   const [connecting ,setConnecting] = useState<string | null>(null)
   const [showPlatformPicker ,setShowPlatformPicker] = useState(false)


   const fetchAccounts = async (isSync = false, platform? : string | null,successMsg?:string) => {
    setAccounts(dummyAccountsData);
    console.log(isSync,platform,successMsg)

   } 
   useEffect(() => {
    fetchAccounts()
   },[])


   const handleDisconnect = async (accountId: string) => {
    setAccounts(accounts.filter((a) => a._id !== accountId));
    };
    const connectedIds = accounts.map((a) => a.platform)

   const handleConnect = async(platformId: string) => {
      //const platform = PLATFORMS[0]
      //setAccounts([...accounts, { id: platform.id, name: platform.name }])
      setConnecting(platformId)
      //setShowPlatformPicker(true)
      setTimeout(() => {
        setConnecting(null)
        setAccounts((prev)=> [...prev,dummyAccountsData[0]])
        setShowPlatformPicker(false)
      },1000)
   }


    return (
        <div className="space-y-8 max-w-4xl">
            {/* header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
                <div>
                    <h2 className="space-y-8 max-w-4xl">Connected Accounts</h2>
                    <p className="text-slate-500 text-sm mt-0.5">{accounts.length} of {PLATFORMS.length} platforms connected</p>
                </div>
                <button onClick={() => setShowPlatformPicker(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center">
                    <PlusIcon className="size-4" />Connect Account
                </button>
                
            </div>

            {/* platform picker model */}

             {showPlatformPicker && <PlatformPickerModal connectedIds ={connectedIds} connecting = {connecting} onClose ={() => setShowPlatformPicker(false)} onConnect ={handleConnect}/>} 


            {/* connected Accounts lists */}

            <AccountList accounts = {accounts} onDisconnect={handleDisconnect}/>
            

        </div>
    )
}

export default Accounts