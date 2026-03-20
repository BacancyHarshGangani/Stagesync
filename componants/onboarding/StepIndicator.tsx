type StepIndicatorProps = {
  step: number
  total: number
}

export default function StepIndicator({step, total }: StepIndicatorProps) {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500">
        Step {step} / {total}
      </p>

      <div className="flex gap-2 mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded ${
              i < step ? "bg-gray-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
