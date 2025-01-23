const mongoose = require('mongoose');

const propertyDocumentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      'ownership_deed',
      'tax_certificate',
      'mutation_document',
      'trade_license',
      'holding_tax_receipt',
      'utility_bills',
      'other'
    ]
  },
  documentNumber: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  documentUrl: {
    type: String,
    required: true
  },
  rejectionReason: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
propertyDocumentSchema.index({ property: 1, documentType: 1 });
propertyDocumentSchema.index({ owner: 1 });
propertyDocumentSchema.index({ verificationStatus: 1 });

const PropertyDocument = mongoose.model('PropertyDocument', propertyDocumentSchema);

module.exports = PropertyDocument;
