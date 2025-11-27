"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText,
  Home,
  Building2,
  Wallet,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ExtractRecord {
  id: string
  type: string
  icon: React.ReactNode
  amount: string
  status: "success" | "pending" | "failed"
  statusText: string
  applyDate: string
  completeDate?: string
  bankName: string
  bankAccount: string
}

const mockRecords: ExtractRecord[] = [
  {
    id: "EXT202411270001",
    type: "租房提取",
    icon: <Home className="h-5 w-5" />,
    amount: "1,500.00",
    status: "pending",
    statusText: "审核中",
    applyDate: "2024-11-27 14:30:25",
    bankName: "中国工商银行",
    bankAccount: "6222****8928"
  },
  {
    id: "EXT202410150002",
    type: "租房提取",
    icon: <Home className="h-5 w-5" />,
    amount: "1,500.00",
    status: "success",
    statusText: "提取成功",
    applyDate: "2024-10-15 09:22:18",
    completeDate: "2024-10-16 10:30:00",
    bankName: "中国工商银行",
    bankAccount: "6222****8928"
  },
  {
    id: "EXT202409120003",
    type: "租房提取",
    icon: <Home className="h-5 w-5" />,
    amount: "1,500.00",
    status: "success",
    statusText: "提取成功",
    applyDate: "2024-09-12 16:45:30",
    completeDate: "2024-09-13 11:20:00",
    bankName: "中国工商银行",
    bankAccount: "6222****8928"
  },
  {
    id: "EXT202408080004",
    type: "购房提取",
    icon: <Building2 className="h-5 w-5" />,
    amount: "50,000.00",
    status: "success",
    statusText: "提取成功",
    applyDate: "2024-08-08 10:15:42",
    completeDate: "2024-08-10 09:00:00",
    bankName: "中国建设银行",
    bankAccount: "6217****5566"
  },
  {
    id: "EXT202407200005",
    type: "租房提取",
    icon: <Home className="h-5 w-5" />,
    amount: "1,500.00",
    status: "failed",
    statusText: "审核未通过",
    applyDate: "2024-07-20 08:30:00",
    bankName: "中国工商银行",
    bankAccount: "6222****8928"
  },
  {
    id: "EXT202406150006",
    type: "租房提取",
    icon: <Home className="h-5 w-5" />,
    amount: "1,500.00",
    status: "success",
    statusText: "提取成功",
    applyDate: "2024-06-15 14:20:35",
    completeDate: "2024-06-16 16:00:00",
    bankName: "中国工商银行",
    bankAccount: "6222****8928"
  },
]

const statusConfig = {
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20"
  },
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20"
  },
  failed: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20"
  }
}

export default function RecordsPage() {
  const router = useRouter()
  const [selectedRecord, setSelectedRecord] = useState<ExtractRecord | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            提取记录
          </h1>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">累计提取</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">¥56,500</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">成功次数</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">5</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">处理中</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">1</p>
          </motion.div>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            全部记录
          </h2>
          
          {mockRecords.map((record, index) => {
            const status = statusConfig[record.status]
            
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRecord(record)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    record.status === "success" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                    record.status === "pending" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                    "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  )}>
                    {record.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {record.type}
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ¥{record.amount}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {record.applyDate.split(" ")[0]}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        status.bg, status.color
                      )}>
                        {status.icon}
                        {record.statusText}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors shrink-0 mt-2" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">提取详情</h3>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium bg-white/20"
                )}>
                  {selectedRecord.statusText}
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-1">{selectedRecord.id}</p>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">提取类型</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{selectedRecord.type}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">提取金额</span>
                <span className="font-semibold text-xl text-orange-500">¥{selectedRecord.amount}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">申请时间</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedRecord.applyDate}</span>
              </div>
              
              {selectedRecord.completeDate && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">完成时间</span>
                  <span className="text-gray-900 dark:text-gray-100">{selectedRecord.completeDate}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">收款银行</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedRecord.bankName}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 dark:text-gray-400">收款账号</span>
                <span className="text-gray-900 dark:text-gray-100">{selectedRecord.bankAccount}</span>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

