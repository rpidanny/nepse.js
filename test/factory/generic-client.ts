import { GenericClient } from '../../src/utils/generic-client'

export class TestGenericClient extends GenericClient {
  protected readonly upstreamName = 'some-website'
  protected readonly endpoint = 'https://some.website'
}
