import { createAction } from '@activepieces/pieces-framework';
import { apifyAuth } from '../..';
import { 
  createApifyClient, 
  createBuildProperty, 
  createRunOptions, 
  handleRunResult, 
  createActorSourceProperty, 
  createActorIdProperty, 
  createActorInputProperty, 
  createMemoryProperty, 
  createTimeoutProperty, 
  createWaitForFinishProperty, 
  RunType 
} from '../common';

export const runActor = createAction({
  name: 'runActor',
  auth: apifyAuth,
  displayName: 'Run Actor',
  description: 'Starts an Apify Actor run.',
  props: {
    actorSource: createActorSourceProperty(),
    actorid: createActorIdProperty(),
    input: createActorInputProperty(),
    build: createBuildProperty(),
    memory: createMemoryProperty(RunType.ACTOR),
    timeout: createTimeoutProperty(RunType.ACTOR),
    waitForFinish: createWaitForFinishProperty(RunType.ACTOR)
  },
  async run(context) {
    const { input, actorid, timeout, build, memory, waitForFinish } = context.propsValue;
    const body = input['body'];

    const client = createApifyClient(context.auth);

    const runOptions = createRunOptions({ timeout, memory, build });
    const run = await client.actor(actorid).call(body, runOptions);

    return handleRunResult(run, waitForFinish || false, client);
  },
});
