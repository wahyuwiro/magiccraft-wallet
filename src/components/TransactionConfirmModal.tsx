// src/components/TransactionConfirmModal.tsx
import React from "react";

interface Props {
  from: string;
  to: string;
  amount: string;
  networkName: string;
  gasFee?: string;
  type?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TransactionConfirmModal({
  from,
  to,
  amount,
  networkName,
  gasFee,
  type = "native", // default to 'transfer'
  onConfirm,
  onCancel
}: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Confirm Transaction</h3>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>From:</strong> {from}</p>
        <p><strong>To:</strong> {to}</p>
        <p><strong>Amount:</strong> {amount}</p>
        <p><strong>Network:</strong> {networkName}</p>
        {gasFee && <p><strong>Estimated Gas Fee:</strong> {gasFee}</p>}
        <div className="modal-actions">
          <button className="cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
