using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class Document
    {
        /// <summary>
        /// A unique document id.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The Title of the Document for Suggestion.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// The Original Filename of the uploaded document.
        /// </summary>
        public string Filename { get; set; }

        /// <summary>
        /// The Data of the Document.
        /// </summary>
        public byte[] Data { get; set; }

        /// <summary>
        /// Keywords to filter for.
        /// </summary>
        public string[] Keywords { get; set; }

        /// <summary>
        /// Suggestions for the Autocomplete Field.
        /// </summary>
        public string[] Suggestions { get; set; }

        /// <summary>
        /// OCR Data.
        /// </summary>
        public bool IsOcrRequested { get; set; }

        /// <summary>
        /// The Date the Document was uploaded.
        /// </summary>
        public DateTime UploadedAt { get; set; }

        /// <summary>
        /// The Date the Document was indexed at.
        /// </summary>
        public DateTime? IndexedAt { get; set; }

        /// <summary>
        /// The Document Status.
        /// </summary>
        public StatusEnum Status { get; set; }
    }
    /// <summary>
    /// Defines all possible states a document can have.
    /// </summary>
    public enum StatusEnum
    {
        /// <summary>
        /// The document has no Status assigned.
        /// </summary>
        None = 0,

        /// <summary>
        /// The document is scheduled for indexing by a BackgroundService.
        /// </summary>
        ScheduledIndex = 1,

        /// <summary>
        /// The document is scheduled for deletion by a BackgroundService.
        /// </summary>
        ScheduledDelete = 2,

        /// <summary>
        /// The document has been indexed.
        /// </summary>
        Indexed = 3,

        /// <summary>
        /// The document indexing has failed due to an error.
        /// </summary>
        Failed = 4,

        /// <summary>
        /// The document has been removed from the index.
        /// </summary>
        Deleted = 5
    }
}
