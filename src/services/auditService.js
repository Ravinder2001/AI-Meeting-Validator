import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchAuditStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('meeting_audits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching audit status from Supabase:", error);
    return [];
  }
};

export const logAuditStart = async (meetingId, summary) => {
  try {
    const { data, error } = await supabase
      .from('meeting_audits')
      .upsert([
        { 
          meeting_id: meetingId, 
          meeting_summary: summary, 
          status: 'auditing',
          updated_at: new Date()
        }
      ], { onConflict: 'meeting_id' });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging audit start to Supabase:", error);
  }
};
