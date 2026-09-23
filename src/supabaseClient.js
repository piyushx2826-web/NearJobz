// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xmlhsaiqkssxxyumkbva.supabase.co'
const supabaseKey = 'sb_publishable_TfFNGPRIrdkMt7tr6EAkPA_XLPklm_i'
export const supabase = createClient(supabaseUrl, supabaseKey)
