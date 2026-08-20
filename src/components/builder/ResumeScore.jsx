import React, { useMemo } from "react";

const ResumeScore = ({ resume }) => {

  const score = useMemo(() => {

    let points = 0;
    let total = 10;

    const personal = resume?.personal || {};

    if (personal.fullname) points++;
    if (personal.email) points++;
    if (personal.phone) points++;
    if (personal.title) points++;

    if (resume?.summary?.trim()) points++;

    if (
      Array.isArray(resume?.experience) &&
      resume.experience.some(
        (item) =>
          item.position ||
          item.company ||
          item.description
      )
    ) {
      points++;
    }

    if (
      Array.isArray(resume?.education) &&
      resume.education.some(
        (item) =>
          item.degree ||
          item.institution
      )
    ) {
      points++;
    }

    if (
      Array.isArray(resume?.skills) &&
      resume.skills.length > 0
    ) {
      points++;
    }

    if (
      Array.isArray(resume?.projects) &&
      resume.projects.some(
        (project) =>
          project.name ||
          project.description
      )
    ) {
      points++;
    }

    if (
      personal.linkedin ||
      personal.website
    ) {
      points++;
    }

    return Math.round((points / total) * 100);

  }, [resume]);


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Resume Strength
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {score}%
          </p>
        </div>

        <div className="relative h-14 w-14">

          <svg
            className="-rotate-90"
            viewBox="0 0 36 36"
          >

            <path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0-31.831"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
            />

            <path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0-31.831"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />

          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-700">
              {score}
            </span>
          </div>

        </div>

      </div>

      <p className="mt-3 text-xs text-slate-500">
        Add more relevant information to strengthen your resume.
      </p>

    </div>
  );
};

export default ResumeScore;