interface IconProps {
    color?: string;
    width?: string;
    height?: string;
}

export const SearchIcon = (props: IconProps) => {
    const { color = "black", width = "100%", height = "100%" } = props || {};

    return (
        <svg
            style={{ width, height }}
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 96 960 960"
            width="48"
            fill={color}
        >
            <path d="M795 963 526 695q-29 22.923-68.459 35.962Q418.082 744 372 744q-115.162 0-195.081-80Q97 584 97 471t80-193q80-80 193.5-80t193 80Q643 358 643 471.15q0 44.85-12.5 83.35Q618 593 593 627l270 268-68 68ZM371.353 650q74.897 0 126.272-52.25T549 471q0-74.5-51.522-126.75T371.353 292q-75.436 0-127.895 52.25Q191 396.5 191 471t52.311 126.75Q295.623 650 371.353 650Z" />
        </svg>
    );
};

export const FilterIcon = (props: IconProps) => {
    const { color = "black", width = "100%", height = "100%" } = props || {};

    return (
        <svg
            style={{ width, height }}
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 96 960 960"
            width="48"
            fill={color}
        >
            <path d="M383 844v-94h194v94H383ZM223 623v-94h514v94H223ZM103 402v-95h754v95H103Z" />
        </svg>
    );
};
