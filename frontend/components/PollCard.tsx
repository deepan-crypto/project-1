import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Share, Modal, TextInput } from 'react-native';
import { Heart, Trash2, MoreVertical, Flag, X } from 'lucide-react-native';
import SendIcon from './SendIcon';
import { router } from 'expo-router';
import API_BASE_URL from '@/config/api';

interface PollOption {
  id: string | number;
  text: string;
  percentage: number;
  emoji?: string;
}

interface PollCardProps {
  id?: string;
  user: {
    name: string;
    avatar: string;
  };
  question: string;
  options: PollOption[];
  likes: number;
  hasVoted?: boolean;
  isLiked?: boolean;
  createdAt?: string;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => Promise<{ likes: number; liked: boolean }>;
  onVote?: (pollId: string, optionIndex: number) => Promise<{ options: PollOption[]; hasVoted: boolean }>;
  isOwnPoll?: boolean;
}

// Format time ago helper function
const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
};

export default function PollCard({
  id,
  user,
  question,
  options: initialOptions,
  likes: initialLikes,
  hasVoted: initialHasVoted = false,
  isLiked: initialIsLiked = false,
  createdAt,
  onDelete,
  onLike,
  onVote,
  isOwnPoll = false,
}: PollCardProps) {
  const [options, setOptions] = useState(initialOptions);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [liking, setLiking] = useState(false);
  const [voting, setVoting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  // Sync state with props when they change (e.g., after refetch)
  useEffect(() => {
    setOptions(initialOptions);
    setHasVoted(initialHasVoted);
    setLikes(initialLikes);
    setIsLiked(initialIsLiked);
  }, [initialOptions, initialHasVoted, initialLikes, initialIsLiked]);

  const handleVote = async (optionIndex: number) => {
    if (!id || !onVote || voting) return;
    setVoting(true);
    try {
      const result = await onVote(id, optionIndex);
      console.log('Vote result:', result);
      console.log('Options received:', result.options);
      if (result.options && result.options.length > 0) {
        setOptions(result.options);
      }
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleLike = async () => {
    if (!id || !onLike || liking) return;
    setLiking(true);
    try {
      const result = await onLike(id);
      setLikes(result.likes);
      setIsLiked(result.liked);
    } catch (error) {
      console.error('Error liking poll:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    if (!id) return;
    try {
      const pollUrl = `myapp://poll/${id}`;
      const result = await Share.share({
        message: `Check out this poll: "${question}"\n\nVote now: ${pollUrl}`,
        title: 'Share Poll',
      });

      if (result.action === Share.sharedAction) {
        console.log('Poll shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing poll:', error);
      Alert.alert('Error', 'Failed to share poll. Please try again.');
    }
  };

  const handleViewLikes = () => {
    if (!id) return;
    router.push(`/poll/${id}/likes`);
  };

  const handleReport = async () => {
    if (!id || !reportReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for reporting this poll');
      return;
    }

    setReporting(true);
    try {
      // Get the auth token from storage
      const { authStorage } = await import('../utils/authStorage');
      const authToken = await authStorage.getToken();

      const response = await fetch(`${API_BASE_URL}/polls/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ reason: reportReason.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Poll reported successfully. Our team will review it.');
        setShowReportModal(false);
        setReportReason('');
        setShowMenu(false);
      } else {
        Alert.alert('Error', data.message || 'Failed to report poll');
      }
    } catch (error) {
      console.error('Error reporting poll:', error);
      Alert.alert('Error', 'Failed to report poll. Please try again.');
    } finally {
      setReporting(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header with user info */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{user.name}</Text>
            {createdAt && <Text style={styles.timeAgo}>{formatTimeAgo(createdAt)}</Text>}
          </View>
          <Text style={styles.question}>{question}</Text>
        </View>
        {!isOwnPoll && (
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.menuButton}
          >
            <MoreVertical size={20} color="#687684" />
          </TouchableOpacity>
        )}
      </View>

      {/* Menu Dropdown */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              setShowReportModal(true);
            }}
          >
            <Flag size={16} color="#FF4444" />
            <Text style={styles.menuItemText}>Report Poll</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Poll Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          // Determine text color based on whether fill has reached the text
          // If percentage >= 50%, the fill has likely reached the center text
          const textReachedByFill = hasVoted && option.percentage >= 50;

          return (
            <View key={option.id || index} style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.option,
                  hasVoted && styles.optionWithProgress,
                  !hasVoted && styles.optionUnvoted,
                ]}
                onPress={() => handleVote(index)}
                disabled={voting}
              >
                {hasVoted && (
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${option.percentage}%` },
                    ]}
                  />
                )}
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      hasVoted && styles.optionTextVoted,
                      !hasVoted && styles.optionTextUnvoted,
                      textReachedByFill && styles.optionTextWhite,
                    ]}
                  >
                    {option.text}{option.emoji ? ` ${option.emoji}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
              {hasVoted && (
                <Text style={styles.optionPercentageVoted}>
                  {option.percentage}%
                </Text>
              )}
            </View>
          );
        })}
      </View>
      {/* Footer with likes and share */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleLike}
            disabled={liking}
          >
            <Heart
              size={18}
              color={isLiked ? "#FF4444" : "#687684"}
              fill={isLiked ? "#FF4444" : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleViewLikes}>
            <Text style={styles.likesText}>{likes}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerRight}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <SendIcon size={18} color="#687684" />
          </TouchableOpacity>
          {onDelete && id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(id)}
            >
              <Trash2 size={18} color="#FF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Poll</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <X size={24} color="#101720" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Why are you reporting this poll?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter reason (e.g., inappropriate content, spam, etc.)"
              placeholderTextColor="#B0B0B0"
              value={reportReason}
              onChangeText={setReportReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitButton, reporting && styles.modalSubmitButtonDisabled]}
                onPress={handleReport}
                disabled={reporting || !reportReason.trim()}
              >
                <Text style={styles.modalSubmitText}>
                  {reporting ? 'Reporting...' : 'Submit Report'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101720',
  },
  timeAgo: {
    fontSize: 12,
    color: '#6C7278',
  },
  question: {
    fontSize: 15,
    color: '#101720',
    marginBottom: 12,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    flex: 1,
    height: 30,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  optionUnvoted: {
    borderColor: '#458FD0',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  optionWithProgress: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#6C7278',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#6C7278',
    borderRadius: 4,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
    color: '#6C7278',
  },
  optionTextVoted: {
    color: '#6C7278',
    fontWeight: '600',
  },
  optionTextUnvoted: {
    color: '#458FD0',
    fontWeight: '600',
  },
  optionTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionPercentageVoted: {
    fontSize: 14,
    color: '#6C7278',
    fontWeight: '600',
    marginLeft: 12,
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  likesText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  likedText: {
    color: '#FF4444',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  menuDropdown: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101720',
  },
  modalLabel: {
    fontSize: 14,
    color: '#6C7278',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#101720',
    minHeight: 100,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#6C7278',
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF4444',
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#FFB0B0',
  },
  modalSubmitText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});