<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String txtUserID=aa.getReqParameterValue("username");
String txtPassword=aa.getReqParameterValue("password");
String strDwdm="";
String strUrl="";
String strtemurl="";
String wsurl="";
if(txtUserID.indexOf("@")!=-1)
{
	strDwdm=txtUserID.split("\\@")[1];
	//session.setAttribute("wsurl","http://172.16.223.180:8100/MobileOA.asmx");
}
else
{
//session.setAttribute("wsurl","http://172.16.223.180:8888/MobileOA.asmx");
session.setAttribute("wsurl","http://www.tlys/MobileOA.asmx");
wsurl=(String)session.getAttribute("wsurl");
}

%>
<%
if(strDwdm!="")
{
%>
<aa:http id="oaurl" keepreqdata="false" method="post" url="http://www.tlys/MobileOA.asmx">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetMobileUrl\""/>
<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetMobileUrl>         
         <tlys:strdwdm><%=strDwdm%></tlys:strdwdm>
      </tlys:GetMobileUrl>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%

 strtemurl = aa.regex(".*","oaurl").replaceAll("xmlns=\"http://www.tlys/\"", "");

%>
<aa:datasource id="oaurlxml" wellformed="true" value="<%=strtemurl %>"></aa:datasource>
<%
strUrl=aa.xpath("//GetMobileUrlResult","oaurlxml");
session.setAttribute("wsurl",strUrl);
 wsurl=(String)session.getAttribute("wsurl");
//System.out.println(wsurl);
}
%>
<aa:http id="oalogin" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/UserLoginCheck\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:UserLoginCheck>         
         <tlys:strUserId><%=txtUserID%></tlys:strUserId>
      <tlys:strPassword><%=txtPassword%></tlys:strPassword></tlys:UserLoginCheck>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oalogin").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oaloginxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//UserLoginCheckResult","oaloginxml") %>