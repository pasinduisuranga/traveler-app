import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    responseRate: 0
  });

  useEffect(() => {
    fetchReviews();
    fetchStatistics();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/providers/1/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Mock data
      setReviews([
        {
          id: 1,
          customerName: 'Sarah Johnson',
          experienceTitle: 'Sinharaja Rainforest Trek',
          rating: 5,
          comment: 'Absolutely amazing experience! The guide was knowledgeable and the sustainability practices were evident throughout.',
          date: '2025-09-15',
          responded: true,
          response: 'Thank you for your wonderful feedback! We\'re glad you enjoyed the experience.',
          responseDate: '2025-09-16',
          photos: 2,
          helpful: 12
        },
        {
          id: 2,
          customerName: 'John Smith',
          experienceTitle: 'Whale Watching at Mirissa',
          rating: 4,
          comment: 'Great tour! Saw multiple whales. Only minor issue was the early morning start time.',
          date: '2025-09-10',
          responded: false,
          photos: 5,
          helpful: 8
        },
        {
          id: 3,
          customerName: 'Emily Chen',
          experienceTitle: 'Sinharaja Rainforest Trek',
          rating: 5,
          comment: 'Best eco-tourism experience I\'ve ever had. The commitment to conservation is inspiring.',
          date: '2025-09-08',
          responded: true,
          response: 'We appreciate your kind words! Conservation is at the heart of what we do.',
          responseDate: '2025-09-09',
          photos: 3,
          helpful: 15
        },
        {
          id: 4,
          customerName: 'Michael Brown',
          experienceTitle: 'Whale Watching at Mirissa',
          rating: 3,
          comment: 'Good experience but weather was not ideal. Would recommend checking forecast before booking.',
          date: '2025-09-05',
          responded: false,
          photos: 1,
          helpful: 5
        }
      ]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/providers/1/reviews/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Mock data
      setStatistics({
        averageRating: 4.5,
        totalReviews: 48,
        ratingDistribution: { 5: 28, 4: 12, 3: 6, 2: 1, 1: 1 },
        responseRate: 75
      });
    }
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      await axios.post(`/api/providers/1/reviews/${reviewId}/reply`, {
        response: replyText
      });
      
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, responded: true, response: replyText, responseDate: new Date().toISOString() }
          : review
      ));
      
      alert('Reply posted successfully!');
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Reply posted!');
    }
  };

  const filteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

  const getStarRating = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">⭐ Reviews & Feedback Management</h2>

      {/* Statistics Overview */}
      <div className="review-statistics">
        <div className="stats-grid">
          <div className="stat-card card">
            <h3>{statistics.averageRating}/5</h3>
            <p>Average Rating</p>
            <div className="rating-stars">{getStarRating(Math.round(statistics.averageRating))}</div>
          </div>
          <div className="stat-card card">
            <h3>{statistics.totalReviews}</h3>
            <p>Total Reviews</p>
            <span className="trend">+12 this month</span>
          </div>
          <div className="stat-card card">
            <h3>{statistics.responseRate}%</h3>
            <p>Response Rate</p>
            <span className="trend">+5% from last month</span>
          </div>
          <div className="stat-card card">
            <h3>{reviews.filter(r => !r.responded).length}</h3>
            <p>Pending Responses</p>
            <span className="urgent">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rating-distribution card">
        <h3>Rating Distribution</h3>
        <div className="distribution-bars">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = statistics.ratingDistribution[rating] || 0;
            const percentage = (count / statistics.totalReviews) * 100;
            return (
              <div key={rating} className="rating-bar-row">
                <span className="rating-label">{rating} ⭐</span>
                <div className="rating-bar">
                  <div 
                    className="rating-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="rating-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="review-controls card">
        <div className="control-group">
          <label>Filter by Rating:</label>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.map(review => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            onReply={handleReplySubmit}
            getStarRating={getStarRating}
          />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="no-reviews card">
          <p>No reviews match your filters.</p>
        </div>
      )}
    </div>
  );
};

const ReviewCard = ({ review, onReply, getStarRating }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="review-card card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">{review.customerName.charAt(0)}</div>
          <div>
            <h4>{review.customerName}</h4>
            <p className="review-date">{review.date}</p>
          </div>
        </div>
        <div className="review-rating">
          <span className="stars">{getStarRating(review.rating)}</span>
          <span className="rating-number">{review.rating}/5</span>
        </div>
      </div>

      <div className="review-experience">
        <strong>Experience:</strong> {review.experienceTitle}
      </div>

      <div className="review-content">
        <p>{review.comment}</p>
        {review.photos > 0 && (
          <div className="review-photos">
            📷 {review.photos} photo{review.photos > 1 ? 's' : ''} attached
          </div>
        )}
      </div>

      <div className="review-meta">
        <span className="helpful">👍 {review.helpful} people found this helpful</span>
      </div>

      {review.responded ? (
        <div className="provider-response">
          <div className="response-header">
            <strong>Your Response</strong>
            <span className="response-date">{review.responseDate}</span>
          </div>
          <p>{review.response}</p>
        </div>
      ) : (
        <div className="review-actions">
          {!showReplyForm ? (
            <button 
              className="button secondary"
              onClick={() => setShowReplyForm(true)}
            >
              Reply to Review
            </button>
          ) : (
            <div className="reply-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response..."
                rows="4"
              />
              <div className="reply-actions">
                <button className="button" onClick={handleSubmitReply}>
                  Post Reply
                </button>
                <button 
                  className="button secondary"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;