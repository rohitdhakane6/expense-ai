import React from "react";

export default function page() {
  return (
    <div className="">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {[...Array(90).keys()].map((i) => (
          <div key={i} className="bg-muted/50 aspect-video rounded-xl" />
        ))}
      </div>
    </div>
  );
}
