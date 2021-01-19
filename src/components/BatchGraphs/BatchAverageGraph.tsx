import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import { Batch } from "../../types";

const BatchAverageGraph: React.FC<{ batch: Batch }> = ({ batch }) => {
  const [chart, setChart] = useState<Chart>();
  const [associate, setAssociate] = useState<string>();

  // Generate chart on component mount
  useEffect(() => {
    // Initialize variables needed to generate a chart
    const gradeArray: any = [];
    const goodGradeArray: Array<number | undefined> = [];
    const passingGradeArray: Array<number | undefined> = [];

    // console.log("Batch Info in Graph: ", batch);

    // Get data into an array of of associates with associate Id, first name, last name, and array of individual grades
    for (const associateAssignment of batch.associateAssignments) {
      //   console.log(
      //     "associate assignment grades: ",
      //     associateAssignment.associate.grades
      //   );
      gradeArray.push({
        salesforceId: associateAssignment.associate.salesforceId,
        firstName: associateAssignment.associate.firstName,
        lastName: associateAssignment.associate.lastName,
      });
      // Add "good grade" for line plot on data array - 1 data point for each associateAssignment
      goodGradeArray.push(batch.goodGrade);

      // Add "passing grade" for line plot #2 on data array = 1 data point for each associateAssignment
      passingGradeArray.push(batch.passingGrade);

      if (associateAssignment.associate.grades) {
        // Get index of current associate
        const salesforceIdIndex = gradeArray.findIndex((el: any) => {
          return el.salesforceId === associateAssignment.associate.salesforceId;
        });
        // Create array for grades
        gradeArray[salesforceIdIndex].grades = [];
        // Push grade scores of current associate onto gradeArray
        for (const gradeObject of associateAssignment.associate.grades) {
          gradeArray[salesforceIdIndex].grades.push(gradeObject.score);
        }
      }
    }

    // console.log("gradeArray= ", gradeArray);

    // Translate new gradeObj into labels and data (average test score) for chart
    const chartLabels: string[] = [];
    const chartData: any = [];
    const barColor: any = [];

    // Get random colors for bars and calculate average grade for each associate
    for (const associate of gradeArray) {
      chartLabels.push(associate.lastName);
      barColor.push(randomColor());
      // Calculate average grade for test
      const avgGrade =
        Math.round(
          (associate.grades.reduce((a: number, b: number) => a + b, 0) /
            associate.grades.length) *
            100
        ) / 100;

      chartData.push(avgGrade);
    }

    // console.log("Labels: ", chartLabels);
    // console.log("Data: ", chartData);
    // console.log("Colors: ", barColor);

    const ctx: any = document.getElementById("myChart");

    // Generate chart
    setChart(new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: chartData,
            label: "Average Grade",
            backgroundColor: barColor,
            hoverBackgroundColor: barColor,
          },
          {
            label: "Good Grade",
            fill: false,
            borderColor: "#474C55",
            data: goodGradeArray,
            pointRadius: 0,
            type: "line",
          },
          {
            label: "Passing Grade",
            fill: false,
            borderColor: "#72A4C2",
            data: passingGradeArray,
            pointRadius: 0,
            type: "line",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Average Assessment Scores",
        },
        layout: {
          padding: 5,
        },
        legend: {
          labels: {
            fontSize: 10,
            filter: function (legendItem, data) {
              // Remove label for bar chart as it is a duplicate of the chart title
              //   and doesn't match the multi colored bars.
              return legendItem.text !== "Average Grade";
            },
          },
          display: true,
        },
        scales: {
          xAxes: [
            {
              ticks: { fontSize: 11,
                maxRotation: 90,
                minRotation: 90
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Associate Last Name",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Average Test Score",
              },
              ticks: {
                beginAtZero: true,
                stepSize: 10,
                max: 100,
              },
            },
          ],
        },
      },
    }));
  }, [batch]);

  // Generate random background colors for bars
  const randomColor = () => {
    return `#${Math.floor(Math.random() * (Math.floor(255) - Math.ceil(204) + 1) + Math.ceil(204)).toString(16) + Math.floor(Math.random() * (Math.floor(128) - Math.ceil(48) + 1) + Math.ceil(48)).toString(16) + Math.floor(Math.random() * (Math.floor(96) - Math.ceil(0) + 1) + Math.ceil(0)).toString(16)}`;
  };

  chart && console.log(associate ? `Clicked bar for ${associate}` : 'Closed grade history');

  return <>
    {/* associate && <LineGraph batch={batch} aid={associate} /> */}
    <canvas style={{width: 400, height: 250}} id="myChart" onClick={e => chart && setAssociate((chart.data.labels as string[])[(chart.getElementAtEvent(e)[0] as { _index:number })?._index])} />
  </>;
};

export default BatchAverageGraph;
