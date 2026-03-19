/**
 * QueuePage.tsx
 *
 * Transaction queue for reviewing and approving pending multisig transactions.
 * Shows:
 * - Pending transactions requiring approval
 * - Signature status for each transaction
 * - Action buttons to approve/reject
 * - Vault activity history
 */

import { useTransactionQueue } from '../hooks/useTransactionQueue'
import { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import type { Signer, SignerApproval } from '../lib/types'

import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { mockActivityItems } from '../lib/mockData'

/**
 * Map SignerApproval → frontend Signer interface
 */
const mapSigners = (signers: SignerApproval[]): Signer[] => {
  return signers.map((s) => ({
    address: s.signerAddress,
    name: s.signerName,
    status:
      s.status === 'approved'
        ? 'active'
        : s.status === 'rejected'
        ? 'inactive'
        : 'pending_removal',
  }))
}

/**
 * Queue page component
 */
export default function QueuePage() {
  const { transactions, loading, refetch, approveTransaction, rejectTransaction } =
    useTransactionQueue()

  const [selectedTxId, setSelectedTxId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleApprove = async (txId: string) => {
    try {
      setActionLoading(true)
      await approveTransaction(txId)
      setSelectedTxId(null)
    } catch (err) {
      console.error('[QueuePage] Error approving transaction:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (txId: string) => {
    try {
      setActionLoading(true)
      await rejectTransaction(txId)
      setSelectedTxId(null)
    } catch (err) {
      console.error('[QueuePage] Error rejecting transaction:', err)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Queue</h1>
        <p className="text-gray-600">
          Review and authorize pending multisig requests. Each transaction requires a minimum of 2
          signatures to execute.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {transactions.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No pending transactions</p>
              <p className="text-sm text-gray-500 mt-1">
                All transactions have been processed or approved
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <Card
                  key={tx.id}
                  className={`p-6 border-l-4 transition-all ${
                    selectedTxId === tx.id ? 'border-l-maroon-600 bg-maroon-50' : 'border-l-gray-200'
                  }`}
                >
                  {/* Transaction Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded">
                          {tx.txId}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : tx.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mt-3">{tx.description}</h3>
                      {tx.value && (
                        <p className="text-sm text-gray-600 mt-1">
                          Amount:{' '}
                          <span className="font-mono font-semibold">
                            {tx.value} {tx.type === 'transfer' ? 'ETH' : ''}
                          </span>
                        </p>
                      )}
                      {tx.recipient && (
                        <p className="text-sm text-gray-600 mt-1">
                          To: <span className="font-mono text-xs">{tx.recipient}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 font-medium">{tx.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Approvals Progress */}
                  <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Signatures: {tx.approvalsReceived}/{tx.approvalsRequired}
                      </p>
                      <span className="text-xs text-gray-500">
                        {tx.approvalsRequired - tx.approvalsReceived} more needed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(tx.approvalsReceived / tx.approvalsRequired) * 100}%`,
                          backgroundColor: '#8B3A62',
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Signers Status */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      Signer Status
                    </p>
                    <div className="space-y-2">
                      {mapSigners(tx.signers).map((signer: Signer) => (
                        <div key={signer.address} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {signer.status === 'active' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : signer.status === 'inactive' ? (
                              <XCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-700">{signer.name}</span>
                          </div>
                          <span className="text-xs font-mono text-gray-500">{signer.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {tx.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => handleReject(tx.id)}
                        disabled={actionLoading}
                        variant="outline"
                        className="flex-1"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(tx.id)}
                        disabled={actionLoading}
                        className="flex-1 bg-maroon-600 hover:bg-maroon-700"
                      >
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Vault Activity */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Vault Activity
            </h3>
            <div className="space-y-3">
              {mockActivityItems.map((item) => (
                <div
                  key={item.id}
                  className="pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {item.type}
                  </p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.timestamp.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Vault Health */}
          <Card
            className="p-6 mt-6"
            style={{ backgroundColor: '#faf5f7', borderColor: '#c99eb8', borderWidth: '1px' }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-wide mb-4"
              style={{ color: '#3d1d2c' }}
            >
              Vault Health
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#5a2940' }}>
                  Institutional
                </p>
                <p className="text-xs" style={{ color: '#8B3A62' }}>
                  Standard Security
                </p>
                <p className="text-xs font-semibold" style={{ color: '#8B3A62' }}>
                  Active.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}