import '@testing-library/jest-dom/extend-expect';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { useQuery } from '@tanstack/react-query';

const fetchMock = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks();

type UseQuery = typeof useQuery;

/*
 * mocks useQuery() so that the `retry` option is set to `false`. Under the hood, this mock
 * still uses the real useQuery hook implementation so everything else should act as normal.
 * We disable retries in the test environment because the default retry typically results in
 * tests that timeout.
 */
vi.mock('react-query', async () => {
    const actual = (await vi.importActual('react-query')) as Record<string, unknown> & {
        default: Record<string, unknown> & {
            useQuery: UseQuery;
        };
    };

    // @ts-expect-error mocking with default, expect typing errors
    const useQueryNoRetry: UseQuery = (queryKey, queryFn, options) =>
        actual.default.useQuery(queryKey, queryFn, {
            ...options,
            // overrides the retry value for useQuery calls so retries are set to false
            retry: false,
        });

    return {
        ...actual,
        useQuery: useQueryNoRetry,
        default: {
            ...actual.default,
            useQuery: useQueryNoRetry,
        },
    };
});
