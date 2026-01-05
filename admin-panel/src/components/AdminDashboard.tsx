import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { pollReportsAPI, userAPI, ReportedPoll, User } from '../lib/api';
import { LogOut, AlertTriangle, FileText, Trash2, CheckCircle, Users, ChevronDown, ChevronUp, List } from 'lucide-react';

export default function AdminDashboard() {
  const { admin, logout } = useAdmin();
  const [reportedPolls, setReportedPolls] = useState<ReportedPoll[]>([]);
  const [allPolls, setAllPolls] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'reported' | 'allPolls' | 'users'>('reported');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userPolls, setUserPolls] = useState<any[]>([]);
  const [userReports, setUserReports] = useState<ReportedPoll[]>([]);
  const [loadingUserData, setLoadingUserData] = useState(false);

  useEffect(() => {
    fetchReportedContent();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    } else if (activeTab === 'allPolls' && allPolls.length === 0) {
      fetchAllPolls();
    }
  }, [activeTab]);

  const fetchReportedContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const pollsResponse = await pollReportsAPI.getAll();
      setReportedPolls(pollsResponse.reports || []);
    } catch (err: any) {
      console.error('Error fetching reported content:', err);
      setError(err.message || 'Failed to load reported content');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const usersResponse = await userAPI.getAll();
      setUsers(usersResponse.users || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPolls = async () => {
    setLoading(true);
    setError(null);

    try {
      const pollsResponse = await pollReportsAPI.getAllPolls();
      setAllPolls(pollsResponse.polls || []);
    } catch (err: any) {
      console.error('Error fetching all polls:', err);
      setError(err.message || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePollFromAll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) return;

    try {
      await pollReportsAPI.deletePollById(pollId);
      await fetchAllPolls();
    } catch (err: any) {
      alert('Error deleting poll: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeletePoll = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) return;

    try {
      await pollReportsAPI.deletePoll(reportId);
      await fetchReportedContent();
    } catch (err: any) {
      alert('Error deleting poll: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await pollReportsAPI.dismissReport(reportId);
      await fetchReportedContent();
    } catch (err: any) {
      alert('Error dismissing report: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This will also delete all their polls. This action cannot be undone.`)) return;

    try {
      await userAPI.deleteUser(userId);
      await fetchUsers();
      // Refresh reported polls as well since user's reports will be affected
      await fetchReportedContent();
    } catch (err: any) {
      alert('Error deleting user: ' + (err.message || 'Unknown error'));
    }
  };

  const handleToggleUserDetails = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setUserPolls([]);
      setUserReports([]);
      return;
    }

    setExpandedUserId(userId);
    setLoadingUserData(true);

    try {
      const [pollsResponse, reportsResponse] = await Promise.all([
        userAPI.getUserPolls(userId),
        userAPI.getUserReports(userId),
      ]);

      setUserPolls(pollsResponse.polls || []);
      setUserReports(reportsResponse.reports || []);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      alert('Error loading user details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingUserData(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{admin?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('reported')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${activeTab === 'reported'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <FileText className="w-4 h-4" />
              Reported Polls
              {reportedPolls.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {reportedPolls.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('allPolls')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${activeTab === 'allPolls'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <List className="w-4 h-4" />
              All Polls
              {allPolls.length > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {allPolls.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${activeTab === 'users'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Users className="w-4 h-4" />
              All Users
              {users.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Reported Polls Tab */}
            {activeTab === 'reported' && (
              <div className="space-y-4">
                {reportedPolls.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No reported polls</h3>
                    <p className="text-slate-600">All reports have been resolved.</p>
                  </div>
                ) : (
                  reportedPolls.map((report) => (
                    <div key={report._id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {report.pollId?.question || 'Poll Deleted'}
                          </h3>
                          {report.pollId && report.pollId.options && (
                            <div className="space-y-1 mb-3">
                              {report.pollId.options.map((option: any, idx: number) => (
                                <div key={idx} className="text-sm text-slate-600">
                                  • {option.text} {option.emoji || ''}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Reported by: {report.reportedBy?.username || 'Unknown'}</span>
                            <span>•</span>
                            <span>Poll by: {report.pollId?.userId?.username || 'Unknown'}</span>
                            <span>•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-red-900 mb-1">Report Reason:</p>
                        <p className="text-sm text-red-800">{report.reason}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDeletePoll(report._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Poll
                        </button>
                        {report.pollId?.userId?._id && (
                          <button
                            onClick={() => handleDeleteUser(report.pollId.userId._id, report.pollId.userId.username)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User & All Polls
                          </button>
                        )}
                        <button
                          onClick={() => handleDismissReport(report._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Dismiss Report
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* All Polls Tab */}
            {activeTab === 'allPolls' && (
              <div className="space-y-4">
                {allPolls.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <List className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No polls found</h3>
                    <p className="text-slate-600">There are no polls in the system yet.</p>
                  </div>
                ) : (
                  allPolls.map((poll) => (
                    <div key={poll._id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                          {poll.question}
                        </h3>
                        {poll.options && (
                          <div className="space-y-1 mb-3">
                            {poll.options.map((option: any, idx: number) => (
                              <div key={idx} className="text-sm text-slate-600">
                                • {option.text} {option.emoji || ''} ({option.voteCount} votes)
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Poll by: {poll.userId?.username || 'Unknown'}</span>
                          <span>•</span>
                          <span>Total votes: {poll.totalVotes}</span>
                          <span>•</span>
                          <span>Likes: {poll.likes}</span>
                          <span>•</span>
                          <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDeletePollFromAll(poll._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Poll
                        </button>
                        {poll.userId?._id && (
                          <button
                            onClick={() => handleDeleteUser(poll.userId._id, poll.userId.username)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User & All Polls
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
                    <p className="text-slate-600">No users are registered in the system.</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-sm border border-slate-200">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={user.profilePicture}
                            alt={user.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{user.fullName}</h3>
                                <p className="text-sm text-slate-600">@{user.username}</p>
                                <p className="text-sm text-slate-500">{user.email}</p>
                                {user.bio && <p className="text-sm text-slate-700 mt-2">{user.bio}</p>}
                              </div>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete User
                              </button>
                            </div>

                            <div className="flex items-center gap-6 mt-4 text-sm text-slate-600">
                              <span>Polls: {user.pollCount}</span>
                              <span>Reports: {user.reportCount}</span>
                              <span>Followers: {user.followersCount}</span>
                              <span>Following: {user.followingCount}</span>
                              <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>

                            <button
                              onClick={() => handleToggleUserDetails(user.id)}
                              className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              {expandedUserId === user.id ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  View Polls & Reports
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded User Details */}
                      {expandedUserId === user.id && (
                        <div className="border-t border-slate-200 p-6 bg-slate-50">
                          {loadingUserData ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* User's Polls */}
                              <div>
                                <h4 className="text-md font-semibold text-slate-900 mb-3">
                                  User's Polls ({userPolls.length})
                                </h4>
                                {userPolls.length === 0 ? (
                                  <p className="text-sm text-slate-600">No polls created yet.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {userPolls.map((poll) => (
                                      <div key={poll.id} className="bg-white rounded-lg p-4 border border-slate-200">
                                        <p className="font-medium text-slate-900 mb-2">{poll.question}</p>
                                        <div className="space-y-1 text-sm text-slate-600">
                                          {poll.options.map((option: any, idx: number) => (
                                            <div key={idx}>
                                              • {option.text} ({option.percentage}%)
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                          <span>{poll.totalVotes} votes</span>
                                          <span>{poll.likes} likes</span>
                                          <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* User's Reports */}
                              <div>
                                <h4 className="text-md font-semibold text-slate-900 mb-3">
                                  Reports Submitted ({userReports.length})
                                </h4>
                                {userReports.length === 0 ? (
                                  <p className="text-sm text-slate-600">No reports submitted.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {userReports.map((report) => (
                                      <div key={report._id} className="bg-white rounded-lg p-4 border border-slate-200">
                                        <p className="font-medium text-slate-900 mb-1">
                                          {report.pollId?.question || 'Poll Deleted'}
                                        </p>
                                        <p className="text-sm text-slate-600 mb-2">
                                          Poll by: {report.pollId?.userId?.username || 'Unknown'}
                                        </p>
                                        <div className="bg-red-50 border border-red-200 rounded p-2">
                                          <p className="text-xs font-medium text-red-900">Reason:</p>
                                          <p className="text-xs text-red-800">{report.reason}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                          {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
