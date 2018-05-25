const helpers = require("../lib/helpers");

describe("shouldFilterChange()", () => {
  const testCases = [
    {
      description: "should be true if a file is created for the first time",
      accumulator: [],
      changes: [{ action: "created", path: "/foo.txt" }],
      change: { action: "created", path: "/foo.txt" },
      expected: true,
    },
    {
      description: "should be true if a file is modified for the first time",
      accumulator: [],
      changes: [{ action: "modified", path: "/foo.txt" }],
      change: { action: "modified", path: "/foo.txt" },
      expected: true,
    },
    {
      description: "should be false if a file was already created",
      accumulator: [{ action: "created", path: "/foo.txt" }],
      changes: [],
      change: { action: "created", path: "/foo.txt" },
      expected: false,
    },
    {
      description: "should be false if a file was already modified",
      accumulator: [{ action: "modified", path: "/foo.txt" }],
      changes: [],
      change: { action: "modified", path: "/foo.txt" },
      expected: false,
    },
    {
      description: "should be false if a file is deleted after being created",
      accumulator: [],
      changes: [{ action: "deleted", path: "/foo.txt" }],
      change: { action: "created", path: "/foo.txt" },
      expected: false,
    },
    {
      description: "should be false if a file is modified after being created",
      accumulator: [{ action: "created", path: "/foo.txt" }],
      changes: [],
      change: { action: "modified", path: "/foo.txt" },
      expected: false,
    },
    {
      description: "should be false if a file is modified after being deleted",
      accumulator: [{ action: "deleted", path: "/foo.txt" }],
      changes: [],
      change: { action: "modified", path: "/foo.txt" },
      expected: false,
    },
    {
      description: "should be false if a file is renamed after being modified",
      accumulator: [],
      changes: [{ action: "renamed", path: "/bar.txt", oldPath: "/foo.txt" }],
      change: { action: "modified", path: "/foo.txt" },
      expected: false,
    },
    {
      description: "should be false if a file is deleted after being modified",
      accumulator: [],
      changes: [{ action: "deleted", path: "/foo.txt" }],
      change: { action: "modified", path: "/foo.txt" },
      expected: false,
    },
  ];

  for (const testCase of testCases) {
    test(testCase.description, () => {
      const received = helpers.shouldFilterEvent(
        testCase.accumulator,
        testCase.change,
        testCase.changes,
      );

      expect(received).toEqual(testCase.expected);
    });
  }
});

describe("filterEvents()", () => {
  const testCases = [
    {
      description: "should return the same events",
      events: [{ action: "created", path: "/foo.txt" }],
      expected: [{ action: "created", path: "/foo.txt" }],
    },
    {
      description: "should only return the created event",
      events: [
        { action: "created", path: "/foo.txt" },
        { action: "modified", path: "/foo.txt" },
      ],
      expected: [{ action: "created", path: "/foo.txt" }],
    },
    {
      description: "should only return the deleted event",
      events: [
        { action: "modified", path: "/foo.txt" },
        { action: "deleted", path: "/foo.txt" },
      ],
      expected: [{ action: "deleted", path: "/foo.txt" }],
    },
    {
      description: "should only return the renamed event",
      events: [
        { action: "modified", path: "/foo.txt" },
        { action: "renamed", path: "/bar.txt", oldPath: "/foo.txt" },
      ],
      expected: [{ action: "renamed", path: "/bar.txt", oldPath: "/foo.txt" }],
    },
    {
      description: "should only return a single modified event",
      events: [
        { action: "modified", path: "/foo.txt" },
        { action: "modified", path: "/foo.txt" },
      ],
      expected: [{ action: "modified", path: "/foo.txt" }],
    },
  ];

  for (const testCase of testCases) {
    test(testCase.description, () => {
      const received = helpers.filterEvents(testCase.events);

      expect(received).toEqual(testCase.expected);
    });
  }
});

describe("normalizeEvents()", () => {
  const testCases = [
    {
      description: "should normalize events with Posix paths",
      events: [{ path: "/foo.txt" }],
      expected: [{ path: "/foo.txt" }],
    },
    {
      description: "should normalize events with Windows paths",
      events: [{ path: "C:\\foo.txt" }],
      expected: [{ path: "C:/foo.txt" }],
    },
    {
      description: "should normalize events with Posix old paths",
      events: [{ path: "/foo.txt", oldPath: "/bar.txt" }],
      expected: [{ path: "/foo.txt", oldPath: "/bar.txt" }],
    },
    {
      description: "should normalize events with Windows old paths",
      events: [{ path: "C:\\foo.txt", oldPath: "C:\\bar.txt" }],
      expected: [{ path: "C:/foo.txt", oldPath: "C:/bar.txt" }],
    },
  ];

  for (const testCase of testCases) {
    test(testCase.description, () => {
      const received = helpers.normalizeEvents(testCase.events);

      expect(received).toEqual(testCase.expected);
    });
  }
});
