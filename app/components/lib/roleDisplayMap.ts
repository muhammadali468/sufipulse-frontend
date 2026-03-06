export const roleDisplayMap = {
  writer: {
    public: "Writers",
    mystical: "Ahl-e-Qalam"
  },
  vocalist: {
    public: "Vocalists",
    mystical: "Ahl-e-Sada"
  },
  engineer: {
    public: "Producers",
    mystical: "Ahl-e-Naghma"
  },
  studio: {
    public: "Studio",
    mystical: "Karkhana-e-Sada"
  },
  editor: {
    public: "Editorial Council",
    mystical: "Majlis-e-Nazr"
  },
  scholar: {
    public: "Scholars",
    mystical: "Ahl-e-Tahqiq"
  },
  radio_host: {
    public: "Radio Hosts",
    mystical: "Ahl-e-Sada-e-Aalam"
  },
  chapter_admin: {
    public: "Chapters",
    mystical: "Rabita"
  }
};

export type RoleKey = keyof typeof roleDisplayMap;

export function getRoleDisplay(role: RoleKey) {
  return roleDisplayMap[role] || { public: role, mystical: role };
}
