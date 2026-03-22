import { motion } from "framer-motion";

export default function KPIBox({ title, value }) {
  return (
    <motion.div
      className="kpi"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </motion.div>
  );
}