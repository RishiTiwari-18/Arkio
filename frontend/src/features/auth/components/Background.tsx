import { motion } from "framer-motion";

function Background() {
  return (
    <div className=" absolute inset-0 -z-20 ">
      <div className="relative min-h-screen bg-background overflow-hidden">
        {/* BIG GLOW BLOB */}
        <motion.div
          className="absolute w-170 h-170 bg-primary/40 dark:bg-primary/30 rounded-full blur-[150px] -top-24 -left-100 md:-left-24"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -60, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* SECONDARY GLOW */}
        <motion.div
          className="absolute w-130 h-130 bg-accent/60 dark:bg-accent/30 rounded-full blur-[120px] -bottom-28 -right-24"
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* EXTRA GLOW (RIGHT BALANCE) */}
        <motion.div
          className="absolute max-md:hidden w-90 h-90 bg-primary/40 dark:bg-primary/35 rounded-full blur-[100px] top-[8%] right-[8%]"
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* SOLID CIRCLE */}
        <motion.div
          className="absolute max-md:hidden w-140 h-140 border border-primary/30 rounded-full -top-48 -left-30"
          animate={{
            rotate: 360,
            x: [0, 10, -10, 0], // 👈 subtle drift
            y: [0, -10, 10, 0],
          }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            x: { duration: 12, repeat: Infinity },
            y: { duration: 14, repeat: Infinity },
          }}
        />

        {/* MAIN RING */}
        <motion.div
          className="absolute w-120 h-120 border-2 border-primary/20 rounded-full top-12 right-16"
          animate={{
            rotate: 360,
            scale: [1, 1.02, 0.98, 1], // 👈 breathing effect
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* INNER RING */}
        <motion.div
          className="absolute w-70 h-70 border border-primary/20 rounded-full top-4 right-10"
          animate={{
            rotate: -360,
            y: [0, -8, 8, 0], // 👈 subtle vertical float
          }}
          transition={{
            rotate: { duration: 18, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* CORNER RINGS */}
        <motion.div
          className="absolute w-100 h-100 border border-primary/20 rounded-full -bottom-20 right-204"
          animate={{
            rotate: 360,
            x: [0, -15, 10, 0], // 👈 THIS makes it feel alive
          }}
          transition={{
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.div
          className="absolute w-70 h-70 bg-primary/40 dark:bg-primary/35 blur-[100px] rounded-full bottom-10 left-90"
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-70 h-70 border border-primary/20 rounded-full bottom-20 left-50"
          animate={{
            rotate: -360,
            y: [0, 12, -8, 0],
          }}
          transition={{
            rotate: { duration: 28, repeat: Infinity, ease: "linear" },
            y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* GLASS MORPH OVERLAY */}
        <div className="pointer-events-none absolute inset-0 z-20  dark:backdrop-blur-xs dark:bg-white/3" />
      </div>
    </div>
  );
}

export default Background;
