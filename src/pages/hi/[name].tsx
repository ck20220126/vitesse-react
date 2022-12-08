import { useNavigate, useParams } from 'react-router-dom'

const Hello: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()

  return (
    <>
      <div className="i-carbon-pedestrian text-4xl inline-block" />
      <p>Hi, {params.name}</p>
      <p className="text-sm opacity-50">
        <em>Dynamic route!</em>
      </p>

      <div>
        <button className="btn m-3 mt-8 text-sm" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </>
  )
}

export default Hello
