import {PageHeader} from "../components/PageHeader.jsx";
import {Bar} from 'react-chartjs-2'
import {Chart } from 'chart.js/auto'
import InfoCard from "../components/Dashboard/InfoCards.jsx";

export const Dashboard=()=>{


    return (
        <div>
            <PageHeader title={'Dashboard'}/>
            <div className={'w-96 h-96'}>

                <Bar
                data={{
                    labels:['A','B','C'],
                    datasets:[{
                        label:'revenue',
                        data:[100,200,300]}
                    ]}
                }
                />
                <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        <InfoCard title="Total Revenue" totalNumber="PKR 200k" />
      </div>
            </div>
        </div>
    )
}