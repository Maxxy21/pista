const mockIntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => {
    return {
        disconnect: vi.fn(),
        observe: vi.fn((el: Element) => {
            callback([{ isIntersecting: true, target: el } as IntersectionObserverEntry], {} as IntersectionObserver);
        }),
        takeRecords: vi.fn(),
        unobserve: vi.fn(),
    };
});

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
});
