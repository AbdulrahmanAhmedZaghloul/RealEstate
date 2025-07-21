
export const normaliseNotification = (raw) => {
      if (!raw) return null;
      // Standard fields we expect:
      const {
            id,
            type,
            data = {},
            read_at = null,
            created_at = raw.created_at || raw.createdAt || new Date().toISOString(),
            updated_at = raw.updated_at || raw.updatedAt || raw.created_at || new Date().toISOString(),
            // fallback fields mapping
            title = raw.title,
            message = raw.message,
      } = raw;

      // unify listing_title naming
      const listing_title = data.listing_title ?? data.title ?? data.listingName ?? title ?? '';

      // unify listing_id naming
      const listing_id = data.listing_id ?? data.listingId ?? data.id ?? null;

      // unify employee_name naming
      const employee_name = data.employee_name ?? data.employeeName ?? data.sender_name ?? '';

      return {
            id: String(id ?? crypto.randomUUID()),
            type: type ?? raw.notification_type ?? 'unknown',
            data: {
                  ...data,
                  listing_title,
                  listing_id,
                  employee_name,
                  message: data.message ?? message ?? '',
            },
            read_at,
            created_at,
            updated_at,
      };
};

export const sortNotificationsDesc = (arr) =>
      [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

export const dedupeNotifications = (arr) => {
      const map = new Map();
      for (const n of arr) {
            map.set(n.id, n);
      }
      return Array.from(map.values());
};

export const deriveUnreadCount = (arr) => arr.reduce((acc, n) => (!n.read_at ? acc + 1 : acc), 0);
