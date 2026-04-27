import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auyeugyqjyhegwnoifqv.supabase.co'
const supabaseKey = 'sb_publishable__SqVFa_k_PFEZuYglg4I7w_Gww_VVFu'

export const supabase = createClient(supabaseUrl, supabaseKey)