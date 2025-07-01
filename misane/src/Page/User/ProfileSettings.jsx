import Button from "@/components/ui/Button";
import React, { useState } from "react";
import EditDetails from "./EditDetails";
import EditAvatar from "./EditAvatar";
import EditPassword from "./EditPassword";

const views = {
  details: {
    name: "Details",
    component: <EditDetails />,
  },
  avatar: {
    name: "Avatar",
    component: <EditAvatar />,
  },
  password: {
    name: "Password",
    component: <EditPassword />,
  },
};

function ProfileSettings() {
  const [viewKey, setViewKey] = useState("details");

  return (
    <section className="w-full min-h-screen flex flex-col items-center px-4 py-8 bg-background">
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {Object.entries(views).map(([key, { name }]) => (
          <Button
            key={key}
            variant={key === viewKey ? "outline" : "secondary"}
            onClick={() => setViewKey(key)}
          >
            {name}
          </Button>
        ))}
      </div>

      <div className="w-full max-w-3xl">{views[viewKey].component}</div>
    </section>
  );
}

export default ProfileSettings;
