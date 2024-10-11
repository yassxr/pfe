 export interface DocumentDto {
    id: number;          // Document ID
    fileName: string;   // Name of the uploaded file
    uploadDate: Date;   // Date the document was uploaded
    status: string;     // Status of the document (e.g., Pending, Approved)
    submittedBy: string; // Email of the user who submitted the document
    validationDate: Date;     // Date when the document was validated
    rejectionReason?: string;  // Reason for non-validation (optional)
    processedBy?: string;      // Email of the agent who processed the document (optional)
    downloadUrl: string;  
    nonValidationDate?: Date; // Add this field  
}
  