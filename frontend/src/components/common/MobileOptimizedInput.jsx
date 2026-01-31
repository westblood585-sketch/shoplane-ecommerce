function MobileOptimizedInput({ label, type = "text", ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm md:text-base font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 md:px-4 py-2.5 md:py-3 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
        {...props}
      />
    </div>
  )
}

export default MobileOptimizedInput