import React, { useState, useRef } from "react";
import { UserProfile, TeacherAssignment, AssignmentSubmission } from "../types";
import {
  saveAssignmentSubmission,
  getAssignmentSubmissions,
  triggerCelebrationConfetti
} from "../utils/storage";
import {
  X,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  MessageSquare,
  FileText
} from "lucide-react";

interface AssignmentUploadModalProps {
  assignment: TeacherAssignment;
  user: UserProfile;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const AssignmentUploadModal: React.FC<AssignmentUploadModalProps> = ({
  assignment,
  user,
  onClose,
  onSubmitted
}) => {
  // Find existing submission for this student and assignment
  const existingSubmissions = getAssignmentSubmissions(assignment.id, user.id);
  const existingSubmission = existingSubmissions.length > 0 ? existingSubmissions[0] : null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingSubmission ? existingSubmission.photoDataUrl : null
  );
  const [studentNote, setStudentNote] = useState<string>(
    existingSubmission?.studentNote || ""
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Validate and process file
  const handleProcessFile = (file: File) => {
    setErrorMsg(null);

    // Validate MIME type & file extension (JPG & PNG ONLY)
    const validMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validExtensions = [".jpg", ".jpeg", ".png"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    const isMimeValid = validMimeTypes.includes(file.type.toLowerCase());
    const isExtValid = validExtensions.includes(fileExtension);

    if (!isMimeValid && !isExtValid) {
      setErrorMsg(
        "Invalid file format! Only JPG and PNG image files are allowed (.jpg, .jpeg, .png). Please take a photo of your handwritten work or upload a valid picture."
      );
      setSelectedFile(null);
      return;
    }

    // Check size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File is too large! Please upload an image under 10MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    // Read and compress slightly if large
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // Auto resize using canvas if image is very large to save localStorage space while preserving sharpness
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
            const compressedUrl = canvas.toDataURL(mime, 0.85);
            setPreviewUrl(compressedUrl);
            return;
          }
        }
        setPreviewUrl(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      setErrorMsg("Please select or capture a photo of your handwritten homework (JPG or PNG only).");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const submission: AssignmentSubmission = {
        id: existingSubmission ? existingSubmission.id : `sub-${Date.now()}`,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        studentId: user.id,
        studentName: user.name,
        studentUsername: user.username || user.id,
        studentAvatar: user.avatarUrl,
        photoDataUrl: previewUrl,
        fileType: selectedFile?.type || existingSubmission?.fileType || "image/jpeg",
        fileName: selectedFile?.name || existingSubmission?.fileName || "homework-photo.jpg",
        fileSizeBytes: selectedFile?.size || existingSubmission?.fileSizeBytes || 102400,
        studentNote: studentNote.trim(),
        submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: existingSubmission?.status || "pending",
        teacherFeedback: existingSubmission?.teacherFeedback,
        teacherGrade: existingSubmission?.teacherGrade,
        reviewedAt: existingSubmission?.reviewedAt
      };

      saveAssignmentSubmission(submission);
      setIsSubmitting(false);
      setIsSuccess(true);
      triggerCelebrationConfetti();

      if (onSubmitted) {
        onSubmitted();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Submit Homework Photo
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                JPG & PNG photo upload for teacher review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assignment Brief Card */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{assignment.title}</span>
            </h4>
            <span className="text-[10px] font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md">
              Level: {assignment.targetLevel}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{assignment.description}</p>
          {assignment.dueDate && (
            <div className="flex items-center space-x-1 text-[11px] text-indigo-700 font-medium pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Due: {assignment.dueDate}</span>
            </div>
          )}
        </div>

        {/* Previous Review Feedback (If graded) */}
        {existingSubmission && existingSubmission.status === "reviewed" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Teacher Evaluation & Grade</span>
              </span>
              {existingSubmission.teacherGrade && (
                <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                  Grade: {existingSubmission.teacherGrade}
                </span>
              )}
            </div>
            {existingSubmission.teacherFeedback ? (
              <p className="text-xs text-emerald-950 bg-white/70 p-3 rounded-xl border border-emerald-200/80 leading-relaxed font-medium">
                "{existingSubmission.teacherFeedback}"
              </p>
            ) : (
              <p className="text-xs text-emerald-800">Your teacher has reviewed your photo submission.</p>
            )}
            <p className="text-[10px] text-emerald-700">Reviewed on {existingSubmission.reviewedAt}</p>
          </div>
        )}

        {/* Existing Pending Submission Notice */}
        {existingSubmission && existingSubmission.status === "pending" && !isSuccess && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You already submitted a photo on <strong>{existingSubmission.submittedAt}</strong>. You can view or upload a new photo below to replace it.
            </span>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Homework Submitted Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your handwritten sentences photo has been uploaded. Your teacher will inspect your handwriting and provide corrections.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                Done & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Image Upload / Drop Zone or Preview */}
            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 bg-slate-950 group">
                  <img
                    src={previewUrl}
                    alt="Homework preview"
                    className="w-full max-h-72 object-contain mx-auto rounded-xl"
                  />
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                    <span className="bg-indigo-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shadow-xs">
                      {selectedFile ? selectedFile.type.replace("image/", "") : "JPG/PNG"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="bg-slate-900/80 hover:bg-rose-600 text-white p-1.5 rounded-lg transition shadow-md cursor-pointer"
                      title="Remove / Retake photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[200px]">
                    {selectedFile?.name || "homework_photo.jpg"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer space-y-3 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-300 hover:border-indigo-400 bg-slate-50/60"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Take a Photo or Upload Image
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Click to browse or drag & drop photo of your handwritten paper
                  </p>
                </div>

                <div className="inline-flex items-center space-x-2 bg-indigo-100/70 border border-indigo-200 text-indigo-900 px-3 py-1 rounded-full text-[11px] font-bold">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Accepts JPG & PNG Formats Only</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs shadow-xs cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Use Phone Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Browse Gallery</span>
                  </button>
                </div>
              </div>
            )}

            {/* Optional Student Comment */}
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Student Notes or Sentences (Optional)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Optional note for your teacher</span>
              </label>
              <textarea
                rows={2}
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="e.g. Teacher, here are my 5 Present Simple sentences about my daily routine..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!previewUrl || isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? "Uploading Homework..." : existingSubmission ? "Update Submission" : "Submit to Teacher"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
