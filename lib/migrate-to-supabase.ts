export async function migrateUserDataToSupabase(userId: string) {
  try {
    // Import supabase client
    const { supabase } = await import("@/lib/supabase")

    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      console.log("Migrating user data to Supabase for user:", userId)

      // First, check if the user already exists in the database
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows found"
        console.error("Error checking if user exists:", checkError)
        return { success: false, error: checkError }
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        // Get user data from localStorage if available
        const userData = localStorage.getItem(`mmu_genius_user_${userId}`)
        let userEmail = ""

        if (userData) {
          try {
            const parsedUserData = JSON.parse(userData)
            userEmail = parsedUserData.email || ""
          } catch (e) {
            console.error("Error parsing user data from localStorage:", e)
          }
        }

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: userId,
            email: userEmail,
            created_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("Error inserting user:", insertError)
          return { success: false, error: insertError }
        }
      }

      // Now handle progress data with better error handling
      const progressData = localStorage.getItem(`mmu_genius_progress_${userId}`)
      if (progressData) {
        try {
          const progress = JSON.parse(progressData)
          if (Array.isArray(progress)) {
            for (const entry of progress) {
              try {
                // Check if this progress entry already exists
                const { data: existingProgress, error: checkProgressError } = await supabase
                  .from("user_progress")
                  .select("id")
                  .eq("user_id", userId)
                  .eq("date", entry.date)
                  .single()

                if (checkProgressError && checkProgressError.code !== "PGRST116") {
                  console.error("Error checking if progress exists:", checkProgressError)
                  continue // Skip this entry but continue with others
                }

                // Only insert if it doesn't exist
                if (!existingProgress) {
                  const { error: insertProgressError } = await supabase.from("user_progress").insert([
                    {
                      user_id: userId,
                      date: entry.date,
                      minutes_studied: entry.minutesStudied || 0,
                      topics_covered: entry.topicsCovered || [],
                    },
                  ])

                  if (insertProgressError) {
                    console.error("Error inserting progress:", insertProgressError)
                  }
                }
              } catch (progressError) {
                console.error("Error processing progress entry:", progressError)
                // Continue with other entries
              }
            }
          }
        } catch (e) {
          console.error("Error parsing progress data from localStorage:", e)
        }
      }

      return { success: true }
    } else {
      console.log("Not in browser environment, skipping migration")
      return { success: false, error: "Not in browser environment" }
    }
  } catch (error) {
    console.error("Error in migrateUserDataToSupabase:", error)
    return { success: false, error }
  }
}
