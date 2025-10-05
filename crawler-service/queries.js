export const addPosts = `
    INSERT INTO posts (target_profile_id, description)
    VALUES %L`;