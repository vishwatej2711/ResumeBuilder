import React from 'react'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'


const RenderResume = ({templateId,resumeData,containerWidth,}) => {
  switch (templateId) {
    case "01":
        return(
            <TemplateOne resumeData={resumeData} containerWidth={containerWidth}></TemplateOne>
        )
    case "02":
        return(
            <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} ></TemplateTwo>
        )

    case "03":
        return(
            <TemplateThree resumeData={resumeData} containerWidth={containerWidth}></TemplateThree>
        )
        default:
            return(
               <TemplateOne resumeData={resumeData} containerWidth={containerWidth}></TemplateOne>
            )
  
   
  }
}

export default RenderResume
