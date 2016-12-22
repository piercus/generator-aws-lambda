import test from 'ava';
import bootstrap from './fixtures/bootstrap';

bootstrap(test, 'get', 'hello');

test('result', async t => {
	const res = await t.context.fn();
	t.is(res, 'world');
});
