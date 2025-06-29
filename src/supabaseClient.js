import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytfvgslusevcjmsefpxt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZnZnc2x1c2V2Y2ptc2VmcHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjMzMjIsImV4cCI6MjA2NjAzOTMyMn0.6kM1ah9rJi0YnpJlQjH394tyByUtKaZBPlx3fg-wTZ0'

export const supabase = createClient(supabaseUrl, supabaseKey)