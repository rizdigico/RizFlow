import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Fintech Platform",
    category: "Product Design",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "E-Commerce App",
    category: "Mobile App",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "SaaS Dashboard",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Brand Identity",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
  },
];

export function Portfolio() {
  return (
    <section
      className="py-32 relative bg-black border-b border-white/5"
      id="work"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 md:flex md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Featured Work
            </h2>
            <p className="text-lg text-gray-400">
              We turn complex problems into elegant solutions. Here's a
              selection of our latest projects.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <button className="text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-colors">
              View All Projects
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-2xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex justify-between items-center group-hover:px-2 transition-all duration-300">
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-400">{project.category}</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transform -rotate-45 group-hover:rotate-0 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
