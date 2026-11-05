import { supabase } from '@/lib/supabase';

function fromRow(row) {
  return {
    id: row.id,
    userId: row.owner_id,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email,
    decoratorName: row.vendor_name,
    designId: row.design_id,
    designName: row.design_name,
    designType: row.design_type,
    eventDate: row.event_date,
    eventType: row.event_type,
    venue: row.venue,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBookingRequests() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('booking_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function createBookingRequest(input) {
  if (!supabase) throw new Error('Connect Supabase and sign in to submit a booking request.');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in before submitting a booking request.');
  const { data, error } = await supabase.from('booking_requests').insert({
    owner_id: user.id,
    requester_name: user.user_metadata?.name || null,
    requester_email: user.email || null,
    vendor_name: input.decoratorName || null,
    design_id: input.designId || null,
    design_name: input.designName || null,
    design_type: input.designType || null,
    event_date: input.eventDate,
    event_type: input.eventType,
    venue: input.venue || null,
    notes: input.notes || null,
  }).select('*').single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateBookingRequestStatus(id, status) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.from('booking_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id).select('*').single();
  if (error) throw error;
  return fromRow(data);
}

export async function removeBookingRequest(id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('booking_requests').delete().eq('id', id);
  if (error) throw error;
}
