import { registerOTel } from '@vercel/otel'

export function register() {
    registerOTel(
    {
    serviceName:'serenade',
    instrumentationConfig: {
        fetch: {
          propagateContextUrls: [
            'http://0.0.0.0:8000/api/v1/'
          ],
        },
      },
    })
}

//instrumentationConfig: { fetch: { propagateContextUrls: [http://0.0.0.0:8000/api/v1/patients/] } }