import * as d3 from "d3-format"

// const formatSeconds = seconds => new Date(seconds.toFixed(3) * 1000).toISOString().substr(11, 12);

function formatSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minuteSeconds = totalSeconds - hours * 3600;
    const minutes = Math.floor(minuteSeconds / 60);
    const secondSeconds = minuteSeconds - minutes * 60;
    const seconds = Math.floor(secondSeconds);
    const millis = (secondSeconds - seconds) * 1000;

    const hoursPart = d3.format("02d")(hours);
    const minutesPart = d3.format("02d")(minutes);
    const secondsPart = d3.format("02d")(seconds);
    const millisPart = d3.format("03d")(millis);

    return `${hoursPart}:${minutesPart}:${secondsPart},${millisPart}`;
}

export default formatSeconds;
