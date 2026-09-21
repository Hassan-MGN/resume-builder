import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { getDrafts, getCompletedResumes } from "../utils/resumeStorage";
import Brand from "./ui/Brand";

const Profile = () => {
  const { session, Signout, deleteAccount } = UserAuth();
  const navigate = useNavigate();
  const email = session?.user?.email || "";
  const displayName = session?.user?.user_metadata?.username || email.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const drafts = getDrafts();
  const completed = getCompletedResumes();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");

  const handleDeleteAccount = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      setDeleteError(error?.message || "We could not delete your account.");
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleSignOut = async () => {
    try { await Signout(); navigate("/"); } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#151719]">
      <header className="sticky top-0 z-30 border-b border-[#DFDED9] bg-[#F4F3EF]/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link to="/dashboard" className="flex items-center gap-3 text-xs font-semibold text-[#626870] hover:text-[#151719]"><span className="text-base"></span> Dashboard</Link>
          <Brand markClassName="h-7 w-7" textClassName="text-sm font-semibold" />
          <Link to="/builder" className="text-xs font-semibold text-[#087CB8] hover:underline">Back to builder</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-9 sm:px-8 lg:py-12">
        <section className="mb-9 overflow-hidden border-b border-[#DFDED9] pb-8">
          <div className="mb-5 grid h-2 w-full grid-cols-3"><span className="bg-[#087CB8]" /><span className="bg-[#E7A83B]" /><span className="bg-[#F26B5E]" /></div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#087CB8]">Account</div>
          <h1 className="mt-2 text-[38px] font-semibold tracking-[-0.045em] sm:text-[48px]">Profile</h1>
          <p className="mt-3 max-w-[650px] text-sm leading-6 text-[#70756F]">Your Resummetry account and workspace activity in one place.</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden border border-[#DCDAD4] bg-white">
            <div className="h-2 bg-[#151719]" />
            <div className="p-7 sm:p-9">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-[#151719] text-xl font-semibold text-white">{initials}</div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#969A93]">Resummetry member</div>
                  <h2 className="mt-1 text-[28px] font-semibold tracking-[-0.035em]">{displayName}</h2>
                  <p className="mt-1 text-sm text-[#70756F] truncate">{email}</p>
                </div>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                <div className="border border-[#E5E3DD] bg-[#F8F7F3] p-4"><div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#999D97]">Display name</div><div className="mt-2 text-sm font-medium">{displayName}</div></div>
                <div className="border border-[#E5E3DD] bg-[#F8F7F3] p-4"><div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#999D97]">Email</div><div className="mt-2 truncate text-sm font-medium">{email}</div></div>
              </div>
            </div>
          </section>

          <section className="border border-[#DCDAD4] bg-[#151719] p-7 text-white sm:p-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ECBE2]">Workspace shortcuts</div>
            <div className="mt-6 space-y-3">
              <Link to="/dashboard" className="flex items-center justify-between border border-white/15 px-4 py-4 text-xs font-semibold hover:bg-white/5"><span>Back to dashboard</span><span></span></Link>
              <Link to="/builder" className="flex items-center justify-between border border-white/15 px-4 py-4 text-xs font-semibold hover:bg-white/5"><span>Back to builder</span><span></span></Link>
              <Link to="/templates" className="flex items-center justify-between border border-white/15 px-4 py-4 text-xs font-semibold hover:bg-white/5"><span>Open template library</span><span></span></Link>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="border border-[#DCDAD4] bg-white p-6"><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#969A93]">Workspace activity</div><div className="mt-4 grid grid-cols-2 gap-3"><div className="border border-[#E5E3DD] p-4"><div className="text-2xl font-semibold">{drafts.length}</div><div className="mt-1 text-[10px] text-[#7E837D]">Drafts</div></div><div className="border border-[#E5E3DD] p-4"><div className="text-2xl font-semibold">{completed.length}</div><div className="mt-1 text-[10px] text-[#7E837D]">Completed resumes</div></div></div></div>
          <div className="border border-[#DCDAD4] bg-white p-6"><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#969A93]">Account</div><button onClick={handleSignOut} className="mt-4 flex w-full items-center justify-between border border-[#E8D5D5] bg-[#FFF8F8] px-4 py-4 text-left text-xs font-semibold text-[#C94B4B] hover:bg-[#FFF1F1] rounded"><span>Sign out of Resummetry</span><span></span></button>{deleteError && <p className="mt-3 rounded border border-[#FCA5A5]/40 bg-[#FEF2F2] px-3 py-2 text-xs text-[#C94B4B]">{deleteError}</p>}<button onClick={() => setDeleteOpen(true)} className="mt-3 flex w-full items-center justify-between px-4 py-3 text-left text-[11px] font-semibold text-[#8B3A3A] hover:bg-[#FFF8F8] rounded"><span>Delete account and cloud data</span><span>Danger zone</span></button></div>
        </section>
      </main>

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="w-full max-w-md border border-[#DCDAD4] bg-white p-6 shadow-2xl">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C94B4B]">Permanent action</div>
            <h2 id="delete-account-title" className="mt-2 text-xl font-semibold">Delete your account?</h2>
            <p className="mt-3 text-sm leading-6 text-[#626870]">This permanently deletes your Resummetry account, saved resumes, and stored resume PDFs. This cannot be undone.</p>
            <div className="mt-6 flex gap-3 justify-end">
              <button disabled={deleting} onClick={() => setDeleteOpen(false)} className="rounded border border-[#DCDAD4] px-4 py-2 text-xs font-semibold disabled:opacity-50">Cancel</button>
              <button disabled={deleting} onClick={handleDeleteAccount} className="rounded bg-[#C94B4B] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{deleting ? "Deleting…" : "Delete permanently"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
