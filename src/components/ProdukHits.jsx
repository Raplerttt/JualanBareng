import React from 'react';

const ProductHits = () => {
  return (
    <div className="relative mb-10 mt-4">
      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-12 pb-28 text-center lg:py-20 lg:pb-36">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M100 50c0 27.62-22.39 50-50 50S0 77.62 0 50 22.39 0 50 0s50 22.38 50 50Z"
            fill="#fff"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.85 47.04c-.22 5.76-3.21 10.69-7.53 13.39-2.08 1.3-3.55 3.49-3.67 6.09l-.38 8.54c-.1 2.31-1.86 4.12-3.98 4.12-2.13 0-3.88-1.82-3.98-4.13l-.38-8.84c-.11-2.59-1.54-4.82-3.58-6.15-4.49-2.93-7.48-8.13-7.64-14.25-.15-5.73.32-11.81 1.21-17.55.33-2.12 2.15-3.58 4.12-3.18 1.94.35 3.25 2.36 2.92 4.47-.65 4.22-1.06 7.08-1.1 12.25-.01 1.47 1.08 2.66 2.43 2.66 1.34 0 2.46-1.18 2.46-2.64l-.02-15c0-2.36 1.94-4.23 4.17-3.83 1.76.31 2.97 2.11 2.97 4.04l.02 14.79c0 1.46 1.08 2.64 2.42 2.64 1.35 0 2.43-1.19 2.43-2.65-.02-5.17-.44-8.03-1.1-12.25-.33-2.11.98-4.12 2.93-4.47 1.91-.39 3.79 1.06 4.11 3.18.96 6.13 1.41 12.63 1.17 18.77Zm20.9-24.12c9.72 0 14.58 14.59 14.58 24.22 0 5.21-2.84 9.7-6.74 12.36-1.87 1.27-3.17 3.29-3.28 5.63l-.46 9.92c-.11 2.3-1.91 4.11-4.1 4.12-2.19-.01-3.99-1.81-4.1-4.12l-.46-9.92c-.11-2.34-1.41-4.36-3.28-5.63-3.9-2.66-6.74-7.15-6.74-12.36 0-9.64 4.86-24.22 14.58-24.22Z"
            fill="#E52535"
          />
        </svg>
        <h1 className="my-2 max-w-[200px] text-gf-content-inverse gf-heading-3xl md:my-4 md:gf-heading-4xl lg:max-w-none lg:gf-heading-5xl">
          Hungry? Just GoFood it
        </h1>
        <p className="max-w-[268px] text-gf-content-inverse gf-body-s md:max-w-sm md:gf-body-m lg:max-w-lg lg:gf-body-l">
          Purchase your favorite meals from your favorite places here, on our web. As smooth as in the app. Same fast
          delivery. Countless restos to try.
        </p>
      </div>

      {/* Location and Explore Button */}
      <div className="bg-gf-background-fill-primary gf-shadow-high rounded-2xl absolute left-[50%] z-10 w-[calc(100vw-48px)] max-w-[400px] -translate-x-[50%] -translate-y-[60%] transform p-4 text-left md:w-[461px] md:max-w-none md:p-6 lg:w-[520px] lg:p-8">
        <span className="mb-2 block text-gf-content-secondary gf-label-xs md:gf-label-s lg:gf-label-m">Your location</span>
        <div className="flex flex-col items-center justify-center space-y-3 text-left md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative w-full max-w-[411px]">
            <div className="w-full gf-body-m placeholder:gf-body-m group bg-white relative flex items-stretch overflow-hidden rounded-full border transition-colors duration-200 focus-within:hover:bg-transparent border-gf-interactive-border-input focus-within:border-gf-interactive-focus bg-gf-interactive-fill-default hover:bg-gf-interactive-fill-hover">
              <div className="absolute left-0 flex h-full shrink-0 items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 ml-1 text-gf-background-fill-brand"
                >
                  <g clipPath="url(#a)">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M12 2c4.505.021 7.956 3.809 8 8.174l-.018.001H20c.04 3.38-2.505 7.261-7.322 11.57-.19.17-.434.255-.678.255-.244 0-.488-.085-.679-.256-4.814-4.308-7.359-8.189-7.319-11.568L4 10.175C4.043 5.81 7.495 2.021 12 2Zm0 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      clipRule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="currentColor" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <input
                readOnly
                placeholder="Enter your location"
                autocomplete="off"
                className="pl-11 pr-11 py-[9px] bg-transparent block grow outline-none min-w-0 placeholder:text-gf-content-muted"
                id="location-picker"
                type="text"
                value="Kebon Pisang"
              />
              <div className="absolute right-0 flex h-full shrink-0 items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2 text-gf-content-brand"
                >
                  <g clipPath="url(#a)">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M17.29 8.296a1 1 0 0 1 1.421 1.407l-5.892 5.954a1.148 1.148 0 0 1-1.636.002L5.29 9.703a1 1 0 1 1 1.422-1.407l5.29 5.345 5.288-5.345Z"
                      clipRule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="currentColor" d="M0 0h24v24H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex bg-green-500 cursor-pointer appearance-none items-center space-x-2 rounded-full text-center outline-none transition-all focus:!border-gf-interactive-focus focus:border disabled:pointer-events-none gf-label-m py-2 px-4 border border-transparent bg-gf-interactive-fill-brand-default hover:bg-gf-interactive-fill-brand-hover focus:bg-gf-interactive-fill-brand-hover text-gf-content-inverse active:bg-gf-interactive-fill-brand-active active:!border-transparent w-full max-w-[411px] justify-center md:w-max md:max-w-none"
          >
            <span>Explore</span>
          </button>
        </div>
      </div>

      {/* Background Image */}
      <div className="center absolute left-2 right-2 top-2 bottom-2 overflow-hidden rounded-3xl">
        <span style={{ boxSizing: 'border-box', display: 'block', overflow: 'hidden', position: 'absolute', inset: 0 }}>
          <img
            alt="Gofood Header"
            src="https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/76d85343-7c7d-4ab8-96fc-8b15d4b60d5f_Mob_home.jpg?auto=format"
            style={{
              position: 'absolute',
              inset: 0,
              padding: 0,
              border: 'none',
              margin: 'auto',
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default ProductHits;
