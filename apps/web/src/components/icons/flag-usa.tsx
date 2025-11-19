export function FlagUSAIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Flag of the United States</title>
      <path d="M0 0h640v480H0z" fill="#fff" />
      <path
        d="M0 0h640v53.3H0zm0 106.7h640v53.3H0zm0 106.7h640v53.3H0zm0 106.7h640v53.3H0zm0 106.6h640v53.4H0z"
        fill="#b22234"
      />
      <path d="M0 0h296.3v213.3H0z" fill="#3c3b6e" />
      <g fill="#fff">
        <g id="d">
          <g id="c">
            <g id="b">
              <g id="a">
                <path
                  d="M30.6 12.3l3.8 11.7h12.3l-9.9 7.2 3.8 11.7-9.9-7.2-9.9 7.2 3.8-11.7-9.9-7.2h12.3l3.8-11.7z"
                  transform="translate(6 6)"
                />
              </g>
              <use xlinkHref="#a" y="36" />
              <use xlinkHref="#a" y="72" />
            </g>
            <use x="25.5" xlinkHref="#b" y="18" />
            <use x="51" xlinkHref="#b" y="36" />
          </g>
          <use xlinkHref="#c" y="54" />
        </g>
        <use x="51" xlinkHref="#d" y="18" />
        <use x="102" xlinkHref="#d" y="0" />
      </g>
    </svg>
  );
}
