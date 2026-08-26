import React, { useState } from "react";
import { AssignmentSubmission } from "../types";
import { gradeAssignmentSubmission, deleteAssignmentSubmission } from "../utils/storage";
import {
  X,
  CheckCircle2,
  Calendar,
  User,
  MessageSquare,
  Award,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Clock,
  Sparkles,
  FileCheck
} from "lucide-react";

interface SubmissionReviewModalProps {
  submission: AssignmentSubmission;
  onClose: () => void;
  onGraded: () => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submission,
  onClose,
  onGraded
}) => {
  const [grade, setGrade] = useState(submission.teacherGrade || "100/100");
  const [feedback, setFeedback] = useState(
    submission.teacherFeedback ||
      "Well done! Your handwriting is clear and sentences are grammatically accurate."
  );
  const [isSaved, setIsSaved] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    gradeAssignmentSubmission(submission.id, grade.trim(), feedback.trim());
    setIsSaved(true);
    setTimeout(() => {
      onGraded();
    }, 400);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this student submission?")) {
      deleteAssignmentSubmission(submission.id);
      onGraded();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-4xl w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <img
              src={submission.studentAvatar}
              alt={submission.studentName}
              className="w-11 h-11 rounded-full object-cover border-2 border-indigo-400 bg-white"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{submission.studentName}</h3>
                <span className="text-xs font-mono text-slate-500">@{submission.studentUsername}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    submission.status === "reviewed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {submission.status === "reviewed" ? "Reviewed" : "Needs Review"}
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-medium">{submission.assignmentTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              title="Delete Submission"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Grid: Photo Viewer on Left, Grading & Feedback Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Left Column: Image Viewer & Tools */}
          <div className="lg:col-span-7 space-y-3 flex flex-col">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Submitted Handwritten Homework Photo</span>
              </span>

              {/* Zoom and Rotate Controls */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.2))}
                  className="p-1 rounded-lg hover:bg-white text-slate-700 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.2))}
                  className="p-1 rounded-lg hover:bg-white text-slate-700 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-1 rounded-lg hover:bg-white text-slate-700 transition cursor-pointer"
                  title="Rotate Photo"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Photo Canvas Container */}
            <div className="relative flex-1 min-h-[300px] max-h-[440px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3">
              <div
                className="transition-transform duration-200 ease-out max-h-full max-w-full flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`
                }}
              >
                <img
                  src={submission.photoDataUrl}
                  alt="Student handwriting homework"
                  className="max-h-[400px] max-w-full object-contain rounded-lg shadow-md select-none"
                />
              </div>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Uploaded on: {submission.submittedAt}</span>
              </div>
              <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Format: {submission.fileType.toUpperCase().replace("IMAGE/", "")}
              </span>
            </div>

            {/* Student Note (if any) */}
            {submission.studentNote && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-slate-500" />
                  <span>Student's Note:</span>
                </span>
                <p className="text-slate-600 italic">"{submission.studentNote}"</p>
              </div>
            )}
          </div>

          {/* Right Column: Teacher Evaluation & Feedback Form */}
          <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-indigo-950 font-bold text-sm mb-3">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Teacher Grading & Feedback</span>
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Grade / Score
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. 100/100, A+, 95/100, Excellent"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["100/100", "95/100", "90/100", "85/100", "A+", "A", "Needs Revision"].map((quickGrade) => (
                      <button
                        type="button"
                        key={quickGrade}
                        onClick={() => setGrade(quickGrade)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                          grade === quickGrade
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        {quickGrade}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Teacher Feedback & Corrections
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Write detailed feedback, grammar corrections, or encouraging remarks for the student..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
                  />
                </div>

                {isSaved && (
                  <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Grade and feedback saved successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save Evaluation & Send to Student</span>
                </button>
              </form>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              The student will instantly see your grade and notes on their dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
