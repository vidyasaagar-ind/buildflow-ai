import { useEffect, useRef, useState } from 'react'

const steps = [
  {
    title: 'Create Project',
    description: 'Start by entering your project idea and basic details.',
    points: [
      'Enter your project idea clearly in one sentence.',
      'Define your target users and expected outcome.',
      'Set a focused goal so planning stays practical.',
    ],
  },
  {
    title: 'Chat with AI',
    description: 'Interact with BuildFlow AI to explain your project goals.',
    points: [
      'Share context about your domain and constraints.',
      'Answer clarification prompts with concrete examples.',
      'Use this stage to remove ambiguity early.',
    ],
  },
  {
    title: 'Complete Stages',
    description: 'Answer stage-wise clarification questions to structure your plan.',
    points: [
      'Cover users, features, UI, and tech decisions.',
      'Review each stage before moving to the next one.',
      'This improves document and prompt quality later.',
    ],
  },
  {
    title: 'Generate Documents',
    description: 'Create BRD, SRS, Roadmap, and TODO from your blueprint.',
    points: [
      'Generate formal planning outputs in one click.',
      'Use documents to align scope and delivery steps.',
      'Refine stages first for better document quality.',
    ],
  },
  {
    title: 'Generate Prompts',
    description: 'Get task-based development prompts for coding AI agents.',
    points: [
      'Create Dev, UI, Backend, and Deployment prompts.',
      'Use prompts as implementation tickets for agents.',
      'Copy or download prompts for your workflow.',
    ],
  },
  {
    title: 'Build Your App',
    description: 'Use documents and prompts to implement and ship your project.',
    points: [
      'Execute tasks in sequence using generated prompts.',
      'Track progress stage by stage in workspace.',
      'Iterate with AI as requirements evolve.',
    ],
  },
]

function HowToUsePage() {
  const [visibleSteps, setVisibleSteps] = useState([])
  const timelineRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSteps((prev) => {
            const key = entry.target.dataset.index
            return prev.includes(key) ? prev : [...prev, key]
          })
        }
      })
    })

    const nodes = timelineRef.current?.querySelectorAll('.roadmap-step') || []
    nodes.forEach((node) => {
      observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-10">
      <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-3xl font-semibold">How to Use BuildFlow AI</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Follow this guided flow from project idea to build-ready execution plan.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <div ref={timelineRef} className="relative border-l border-gray-300 dark:border-gray-700">
          {steps.map((step, index) => (
            <div
              key={step.title}
              data-index={String(index)}
              className={`roadmap-step mb-10 ml-6 transition-all duration-700 ${
                visibleSteps.includes(String(index)) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="group relative flex items-start gap-4 transition-all duration-300 ease-in-out">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 font-bold text-white transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-110">
                  {index + 1}
                </span>
                <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{step.description}</p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1 list-disc ml-5 dark:text-gray-300">
                    {step.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default HowToUsePage
