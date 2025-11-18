import Image from "next/image";
import { Award, Mail, MessageCircle, Phone } from "lucide-react";

interface AgentContactCardProps {
  agent: {
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    yearsExperience: number;
    propertiesSold: number;
  };
}

export function AgentContactCard({ agent }: AgentContactCardProps) {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden lg:sticky lg:top-4">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-base sm:text-lg font-bold text-white">Contact Agent</h2>
        <p className="text-green-100 text-xs sm:text-sm mt-1">Get expert assistance with this property</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
          <div className="relative flex-shrink-0">
            <Image
              src={agent.avatar}
              alt={agent.name}
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">{agent.title}</p>
            <p className="text-xs text-gray-400">{agent.company}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase font-semibold">Experience</p>
            <p className="text-lg font-bold text-emerald-700">{agent.yearsExperience}+ yrs</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-xs text-green-600 uppercase font-semibold">Homes Sold</p>
            <p className="text-lg font-bold text-green-700">{agent.propertiesSold}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-amber-500">
            <Award className="w-5 h-5" />
            <span className="text-sm font-semibold">{agent.rating}</span>
          </div>
          <span className="text-xs text-gray-500">{agent.reviewCount} reviews</span>
        </div>
        <div className="space-y-2 mb-4">
          {agent.specialties.map((specialty) => (
            <span key={specialty} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {specialty}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:opacity-90 transition">
            <Phone className="w-4 h-4" />
            Call {agent.phone}
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-green-200 text-green-700 font-semibold py-2.5 rounded-xl hover:bg-green-50 transition">
            <Mail className="w-4 h-4" />
            Email {agent.email}
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
            <MessageCircle className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}


