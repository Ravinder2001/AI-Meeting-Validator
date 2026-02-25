import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchAuditStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*, meetings(*)')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching audit status from Supabase:", error);
    return [];
  }
};

export const logAuditStart = async (meeting, user) => {
  try {
    // 1. Ensure meeting exists in 'meetings' table
    const { error: meetingError } = await supabase
      .from('meetings')
      .upsert({
        meeting_id: meeting.id,
        title: meeting.summary,
        organizer_email: user?.email || meeting.organizer?.email || "unknown",
        created_at: new Date()
      }, { onConflict: 'meeting_id' });

    if (meetingError) throw meetingError;

    // 2. Create/update audit report entry
    const { data, error } = await supabase
      .from('audit_reports')
      .upsert([
        { 
          meeting_id: meeting.id, 
          status: 'pending',
          updated_at: new Date()
        }
      ], { onConflict: 'meeting_id' });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging audit start to Supabase:", error);
    throw error;
  }
};

export const fetchPastMeetingReports = async () => {
  try {
    const { data, error } = await supabase
      .from('audit_reports')
      .select('*, meetings(*)')
      .eq('status', 'completed')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching past meeting reports:", error);
    return [];
  }
};
