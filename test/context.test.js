import React from 'react';
import { StaticKitProvider, useStaticKit } from '../src';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { createClient } from '@statickit/core';
import { ErrorBoundary } from './helpers';

jest.mock('@statickit/core');

const { act } = ReactTestUtils;

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('instantiates a client and provides it via useStaticKit hook', () => {
  createClient.mockImplementation(() => ({
    startBrowserSession: () => {},
    name: 'Client'
  }));

  const Component = () => {
    const client = useStaticKit();
    return <div id="client">{client.name}</div>;
  };

  const Page = ({ site }) => {
    return (
      <StaticKitProvider site={site}>
        <Component />
      </StaticKitProvider>
    );
  };

  act(() => {
    ReactDOM.render(<Page site="xxx" />, container);
  });

  expect(container.querySelector('#client').textContent).toBe('Client');
});

it('throws an error if site prop is not provided', () => {
  // Mock error console to suppress noise in output
  console.error = jest.fn();

  act(() => {
    ReactDOM.render(
      <ErrorBoundary>
        <StaticKitProvider></StaticKitProvider>
      </ErrorBoundary>,
      container
    );
  });

  const error = container.querySelector('#error');
  expect(error.textContent).toBe('site is required');
});
