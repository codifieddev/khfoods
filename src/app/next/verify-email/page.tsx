import React from "react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { getMongoDb } from "@/data/mongo/client";
import { Link } from "@/i18n/routing";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export const dynamic = "force-dynamic";

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;
  
  if (!token) {
    return <ErrorState message="No verification token provided." />;
  }

  try {
    const db = await getMongoDb();
    
    // Find customer with this verification token
    const customer = await db.collection("customers").findOne({
      _verificationToken: token
    });

    if (!customer) {
       return <ErrorState message="Invalid or expired verification token." />;
    }

    // Update customer status
    await db.collection("customers").updateOne(
      { _id: customer._id },
      { 
        $set: { 
          _verified: true,
          updatedAt: new Date().toISOString()
        },
        $unset: {
          _verificationToken: "" // Remove token once used
        }
      }
    );

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-12 text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           
           <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight italic">Account Verified!</h1>
           <p className="text-gray-500 font-medium mb-10 leading-relaxed">
             Your account is now fully verified. You can now access all features of KH Foods.
           </p>

           <Link 
             href="/login" 
             className="inline-flex items-center justify-center w-full h-14 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest group hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
           >
             Sign In Now
             <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    );

  } catch (error) {
    console.error("Verification error:", error);
    return <ErrorState message="An unexpected error occurred during verification." />;
  }
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-12 text-center shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
         <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
            <XCircle className="w-10 h-10" />
         </div>
         
         <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight italic">Verification Failed</h1>
         <p className="text-gray-500 font-medium mb-10 leading-relaxed">{message}</p>

         <Link 
           href="/contact-us" 
           className="inline-flex items-center justify-center w-full h-14 border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
         >
           Contact Support
         </Link>
      </div>
    </div>
  );
}
