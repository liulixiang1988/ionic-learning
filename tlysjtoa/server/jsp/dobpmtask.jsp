<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
//获取参数
//String businessId=aa.getReqParameterValue("businessid");
//String flowId=aa.getReqParameterValue("flowid");
//String nodeId=aa.getReqParameterValue("nodeid");
//String bFlowOrderId=aa.getReqParameterValue("bfloworderid");
String inData=aa.getReqParameterValue("inData");
//String userid=aa.getReqParameterValue("userid");
//String approval=aa.getReqParameterValue("approval");
String wsurl="http://tgitbpm.tlys/WorkFlowApi.asmx";
%>
<aa:http id="tgitdobpm" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://tgitbpm.tlys/DoSubmit\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tgit="http://tgitbpm.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tgit:DoSubmit>        
         <tgit:inData><%=inData %></tgit:inData>        
      </tgit:DoSubmit>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","tgitdobpm").replaceAll("xmlns=\"http://tgitbpm.tlys/\"", "");
System.out.println(strxml);
%>
<aa:datasource id="tgitdobpmxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//DoSubmitResult","tgitdobpmxml") %>