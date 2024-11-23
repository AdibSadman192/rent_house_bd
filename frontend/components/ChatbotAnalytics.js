import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChatbotAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [improvements, setImprovements] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        analyticsRes,
        interactionsRes,
        feedbackRes,
        improvementsRes,
      ] = await Promise.all([
        axios.get(`/api/chatbot/admin/analytics?timeRange=${timeRange}`),
        axios.get(`/api/chatbot/admin/interactions?timeRange=${timeRange}`),
        axios.get(`/api/chatbot/admin/feedback-summary?timeRange=${timeRange}`),
        axios.get('/api/chatbot/admin/improvements'),
      ]);

      setAnalytics(analyticsRes.data);
      setInteractions(interactionsRes.data.interactions);
      setFeedbackSummary(feedbackRes.data);
      setImprovements(improvementsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      analytics,
      interactions,
      feedbackSummary,
      improvements,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ label, value, helpText, icon }) => (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          {icon}
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        {helpText && (
          <Typography variant="caption" color="text.secondary">
            {helpText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: 3 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Chatbot Analytics
          </Typography>
          <Stack direction="row" spacing={2}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              size="small"
              sx={{ width: 200 }}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
            <Tooltip title="Refresh data">
              <IconButton onClick={fetchData} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export data">
              <IconButton onClick={handleExportData}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {analytics && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Grow in={true} timeout={500}>
                  <StatCard
                    label="Total Interactions"
                    value={analytics.totalInteractions}
                    helpText={`${analytics.interactionsChange}% vs previous period`}
                    icon={<InfoIcon color="primary" />}
                  />
                </Grow>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Grow in={true} timeout={500}>
                  <StatCard
                    label="Success Rate"
                    value={`${(analytics.successRate * 100).toFixed(1)}%`}
                    helpText={`${analytics.successRateChange}% vs previous period`}
                    icon={<InfoIcon color="primary" />}
                  />
                </Grow>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Grow in={true} timeout={500}>
                  <StatCard
                    label="Avg Response Time"
                    value={`${analytics.avgResponseTime}ms`}
                    helpText={`${analytics.responseTimeChange}% vs previous period`}
                    icon={<InfoIcon color="primary" />}
                  />
                </Grow>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Grow in={true} timeout={500}>
                  <StatCard
                    label="Human Handoffs"
                    value={analytics.humanHandoffs}
                    helpText={`${analytics.handoffChange}% vs previous period`}
                    icon={<WarningIcon color="warning" />}
                  />
                </Grow>
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Interaction Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={interactions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="interactions"
                        stroke={theme.palette.primary.main}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="successfulInteractions"
                        stroke={theme.palette.success.main}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Feedback Distribution
                </Typography>
                {feedbackSummary && (
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Positive', value: feedbackSummary.positive },
                            { name: 'Neutral', value: feedbackSummary.neutral },
                            { name: 'Negative', value: feedbackSummary.negative },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Improvements
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {improvements.map((improvement) => (
                      <TableRow key={improvement.id}>
                        <TableCell>
                          {format(new Date(improvement.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{improvement.type}</TableCell>
                        <TableCell>{improvement.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={improvement.status}
                            color={
                              improvement.status === 'Completed'
                                ? 'success'
                                : improvement.status === 'In Progress'
                                ? 'warning'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default ChatbotAnalytics;
